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

const CATEGORY_IMAGES: Record<string, string[]> = {
  world: [
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  ],
  technology: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  ],
  business: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  ],
  sports: [
    "https://images.unsplash.com/photo-1461896836934-bd45ba7b5b96?w=800&q=80",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
  ],
  health: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80",
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80",
  ],
  entertainment: [
    "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&q=80",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  ],
  science: [
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
    "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=80",
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general";

    const cacheKey = `cat_${category}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        articles: cached.data,
        totalResults: cached.data.length,
        category,
        cached: true,
      });
    }

    const queries: Record<string, string> = {
      world: "world news international events today",
      technology: "technology news AI gadgets software today",
      business: "business news economy finance markets today",
      sports: "sports news football basketball soccer today",
      health: "health news medicine wellness research today",
      entertainment: "entertainment news movies music celebrity today",
      science: "science news space physics biology research today",
    };

    const query = queries[category] || "latest news today";

    const zai = await ZAI.create();
    const results = await zai.functions.invoke("web_search", {
      query,
      num: 15,
      recency_days: 3,
    });

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({
        success: true,
        articles: [],
        totalResults: 0,
        category,
      });
    }

    const filtered = results.filter(
      (r: { name: string; snippet: string; url: string }) =>
        r.name && r.name.length > 15 && r.snippet && r.url &&
        !r.url.includes("pinterest") && !r.url.includes("facebook")
    );

    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.world;

    const articles: NewsArticle[] = filtered.slice(0, 12).map(
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
          title: result.name,
          description: result.snippet || "",
          content: result.snippet || "",
          url: result.url,
          image: images[index % images.length],
          source: sourceName,
          sourceIcon: result.favicon || null,
          publishedAt: result.date || new Date().toISOString(),
          category,
        };
      }
    );

    cache.set(cacheKey, { data: articles, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      articles,
      totalResults: articles.length,
      category,
    });
  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json(
      { success: false, articles: [], totalResults: 0, error: "Failed to fetch category news" },
      { status: 500 }
    );
  }
}
