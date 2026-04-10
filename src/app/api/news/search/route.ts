import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import type { NewsArticle } from "@/types/news";

const cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

function generateId(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1504711434969-e33886168d3c?w=800&q=80",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'q' is required", articles: [], totalResults: 0 },
        { status: 400 }
      );
    }

    const cacheKey = `search_${query.trim().toLowerCase()}_${page}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        articles: cached.data,
        totalResults: cached.data.length,
        query,
        cached: true,
      });
    }

    const searchQuery = `${query} news latest 2025`;

    const zai = await ZAI.create();
    const results = await zai.functions.invoke("web_search", {
      query: searchQuery,
      num: 20,
      recency_days: 7,
    });

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({
        success: true,
        articles: [],
        totalResults: 0,
        query,
      });
    }

    const filtered = results.filter(
      (r: { name: string; snippet: string; url: string }) =>
        r.name &&
        r.name.length > 15 &&
        r.snippet &&
        r.snippet.length > 30 &&
        r.url &&
        !r.url.includes("pinterest") &&
        !r.url.includes("facebook") &&
        !r.url.includes("twitter")
    );

    const articles: NewsArticle[] = filtered.slice(0, 15).map(
      (result: {
        url: string;
        name: string;
        snippet: string;
        host_name: string;
        date: string;
        favicon: string;
      }, index: number) => {
        const domain = result.host_name || new URL(result.url).hostname;
        const sourceName = domain
          .replace(/^www\./, "")
          .split(".")
          .slice(0, -1)
          .join(".")
          .replace(/\b\w/g, (c: string) => c.toUpperCase());

        return {
          id: generateId(result.url),
          title: result.name || "Untitled",
          description: result.snippet || "",
          content: result.snippet || "",
          url: result.url,
          image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
          source: sourceName,
          sourceIcon: result.favicon || null,
          publishedAt: result.date || new Date().toISOString(),
          category: "general" as const,
        };
      }
    );

    cache.set(cacheKey, { data: articles, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      articles,
      totalResults: articles.length,
      query,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, articles: [], totalResults: 0, error: "Search failed" },
      { status: 500 }
    );
  }
}
