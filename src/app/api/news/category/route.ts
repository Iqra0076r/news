import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import type { NewsArticle } from "@/types/news";

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
  const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (ogMatch && ogMatch[1]) return ogMatch[1];
  const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
  if (twMatch && twMatch[1]) return twMatch[1];
  const imgMatch = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/i);
  if (imgMatch && imgMatch[1]) return imgMatch[1];
  return null;
}

const cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
const CACHE_DURATION = 20 * 60 * 1000;

const articleCache = new Map<string, { title: string; html: string; image: string | null; publishedTime: string | null; timestamp: number }>();
const ARTICLE_CACHE_MS = 30 * 60 * 1000;

async function readArticleContent(url: string) {
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
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general";

    const cacheKey = `cat_${category}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({ success: true, articles: cached.data, totalResults: cached.data.length, category, cached: true });
    }

    const queries: Record<string, string> = {
      world: "world news international events",
      technology: "technology science AI innovation",
      business: "business economy finance trade",
      sports: "sports football cricket olympics",
      health: "health medical science disease",
      entertainment: "entertainment culture arts film music",
      science: "science space climate environment discovery",
    };

    const query = queries[category] || "breaking news report";

    const zai = await ZAI.create();
    const results = await zai.functions.invoke("web_search", {
      query: `"aljazeera.com/news" ${query} 2025`,
      num: 15,
      recency_days: 14,
    });

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ success: true, articles: [], totalResults: 0, category });
    }

    interface SearchResult { url: string; name: string; snippet: string; host_name: string; date: string; favicon: string }

    const filtered = (results as SearchResult[]).filter((r) => {
      if (!r.url || !r.url.includes("aljazeera.com") || !r.url.includes("/news/")) return false;
      if (r.url.includes("/liveblog/")) return false;
      if (!r.name || r.name.length < 20) return false;
      if (r.name.includes("Today's latest from") || r.name.includes("| Today's latest")) return false;
      return true;
    });

    // Fetch article content for results to get images
    const topUrls = filtered.slice(0, 6).map((r) => r.url);
    const articleDataMap = new Map<string, { title: string; html: string; image: string | null; publishedTime: string | null }>();

    for (let i = 0; i < topUrls.length; i++) {
      if (i > 0) await new Promise((r) => setTimeout(r, 1000));
      const data = await readArticleContent(topUrls[i]);
      if (data) articleDataMap.set(topUrls[i], data);
    }

    const articles: NewsArticle[] = filtered.slice(0, 12).map((result) => {
      const ad = articleDataMap.get(result.url);
      const plainText = ad?.html ? ad.html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
      return {
        id: generateId(result.url),
        title: (ad?.title || result.name).trim(),
        description: result.snippet || (plainText ? plainText.slice(0, 300) : ""),
        content: ad?.html || result.snippet || "",
        url: result.url,
        image: ad?.image || null,
        source: "Al Jazeera",
        sourceIcon: result.favicon || "https://www.aljazeera.com/favicon.ico",
        publishedAt: ad?.publishedTime || result.date || new Date().toISOString(),
        category,
      };
    });

    cache.set(cacheKey, { data: articles, timestamp: Date.now() });

    return NextResponse.json({ success: true, articles, totalResults: articles.length, category });
  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json({ success: false, articles: [], totalResults: 0, error: "Failed to fetch category news" }, { status: 500 });
  }
}
