import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import type { NewsArticle } from "@/types/news";

// ── Shared helpers ──────────────────────────────────────────────
function generateId(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function extractFirstImage(html: string): string | null {
  // Try og:image first
  const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (ogMatch && ogMatch[1]) return ogMatch[1];

  // Try twitter:image
  const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
  if (twMatch && twMatch[1]) return twMatch[1];

  // Try first <img> with a reasonable src
  const imgMatch = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/i);
  if (imgMatch && imgMatch[1]) return imgMatch[1];

  return null;
}

function cleanHtmlContent(html: string): string {
  // Remove scripts, styles, nav, footer, ads, comments
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/class=["'][^"']*["']/gi, "")
    .replace(/style=["'][^"']*["']/gi, "")
    .trim();
}

// Page content cache (article full reads) – 30 minutes
const articleCache = new Map<string, { title: string; html: string; image: string | null; publishedTime: string | null; timestamp: number }>();
const ARTICLE_CACHE_MS = 30 * 60 * 1000;

async function readArticleContent(url: string): Promise<{ title: string; html: string; image: string | null; publishedTime: string | null } | null> {
  const cached = articleCache.get(url);
  if (cached && Date.now() - cached.timestamp < ARTICLE_CACHE_MS) {
    return { title: cached.title, html: cached.html, image: cached.image, publishedTime: cached.publishedTime };
  }

  try {
    const zai = await ZAI.create();
    const result = await zai.functions.invoke("page_reader", { url });

    if (!result || !result.data) return null;

    const data = result.data as { title?: string; html?: string; publishedTime?: string };
    const title = data.title || "";
    const html = data.html || "";
    const image = extractFirstImage(html);
    const publishedTime = data.publishedTime || null;

    articleCache.set(url, { title, html, image, publishedTime, timestamp: Date.now() });
    return { title, html, image, publishedTime };
  } catch (err) {
    console.error(`Failed to read article ${url}:`, err);
    return null;
  }
}

// ── Search helper (Al Jazeera only) ───────────────────────────
const searchCache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
const SEARCH_CACHE_MS = 20 * 60 * 1000;

interface SearchResult {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
  date: string;
  favicon: string;
  rank: number;
}

async function searchAlJazeera(query: string, num = 15): Promise<SearchResult[]> {
  const cacheKey = `search:${query}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_MS) {
    // Return raw results (need to re-fetch article content separately)
    return [];
  }

  const zai = await ZAI.create();
  const results = await zai.functions.invoke("web_search", {
    query: `"aljazeera.com/news" ${query} 2025`,
    num: num + 10,
    recency_days: 14,
  });

  if (!Array.isArray(results)) return [];

  const filtered = results
    .filter((r: SearchResult) => {
      if (!r.url || !r.url.includes("aljazeera.com")) return false;
      // Must be a news article URL
      if (!r.url.includes("/news/")) return false;
      // Skip live blogs and video pages
      if (r.url.includes("/liveblog/")) return false;
      // Skip generic titles
      if (!r.name || r.name.length < 20) return false;
      if (r.name.includes("Today's latest from")) return false;
      if (r.name.includes("Breaking News, World News")) return false;
      if (r.name.includes("| Today's latest")) return false;
      return true;
    })
    .slice(0, num);
}

// Fetch article content for a batch of URLs with rate limiting
async function fetchArticleData(urls: string[]): Promise<Map<string, { title: string; html: string; image: string | null; publishedTime: string | null }>> {
  const results = new Map();

  for (let i = 0; i < urls.length; i++) {
    const cached = articleCache.get(urls[i]);
    if (cached && Date.now() - cached.timestamp < ARTICLE_CACHE_MS) {
      results.set(urls[i], { title: cached.title, html: cached.html, image: cached.image, publishedTime: cached.publishedTime });
      continue;
    }

    // Add delay between requests to avoid rate limits
    if (i > 0) await new Promise((r) => setTimeout(r, 800));

    const data = await readArticleContent(urls[i]);
    if (data) {
      results.set(urls[i], data);
    }
  }

  return results;
}

function searchResultToArticle(result: SearchResult, articleData?: { title: string; html: string; image: string | null; publishedTime: string | null } | null, category = "general"): NewsArticle {
  const plainText = articleData?.html
    ? articleData.html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
    : "";

  return {
    id: generateId(result.url),
    title: (articleData?.title || result.name || "Untitled").trim(),
    description: result.snippet || (plainText ? plainText.slice(0, 300) : ""),
    content: articleData?.html || result.snippet || "",
    url: result.url,
    image: articleData?.image || null,
    source: "Al Jazeera",
    sourceIcon: result.favicon || "https://www.aljazeera.com/favicon.ico",
    publishedAt: articleData?.publishedTime || result.date || new Date().toISOString(),
    category,
  };
}

// ── Main GET handler ───────────────────────────────────────────
const listCache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
const LIST_CACHE_MS = 20 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general";

    const cacheKey = `${category}`;
    const cached = listCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < LIST_CACHE_MS) {
      return NextResponse.json({ success: true, articles: cached.data, totalResults: cached.data.length, category, cached: true });
    }

    const categoryQueries: Record<string, string> = {
      general: "breaking news headlines report analysis",
      world: "world international diplomacy conflict",
      technology: "technology AI digital innovation science",
      business: "economy business trade finance markets",
      sports: "sports football cricket tennis match",
      health: "health medicine disease pandemic research",
      entertainment: "entertainment culture arts music film",
      science: "science space climate environment discovery",
    };

    const query = categoryQueries[category] || categoryQueries.general;
    const results = await searchAlJazeera(query, 12);

    if (results.length === 0) {
      return NextResponse.json({ success: true, articles: [], totalResults: 0, category });
    }

    // Fetch full article data for top 4 results only (hero + a few cards) to save API calls
    const topResults = results.slice(0, 4);
    const articleDataMap = await fetchArticleData(topResults.map((r) => r.url));

    const articles: NewsArticle[] = results.map((result, index) =>
      searchResultToArticle(result, articleDataMap.get(result.url), category)
    );

    listCache.set(cacheKey, { data: articles, timestamp: Date.now() });

    return NextResponse.json({ success: true, articles, totalResults: articles.length, category });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json({ success: false, articles: [], totalResults: 0, error: "Failed to fetch news" }, { status: 500 });
  }
}

// Export helpers for the article reader route
export { readArticleContent, cleanHtmlContent, articleCache };
