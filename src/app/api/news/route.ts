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

function extractImageFromSnippet(snippet: string): string | null {
  return null; // Web search doesn't provide images
}

function searchResultToArticle(result: {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
  date: string;
  favicon: string;
  rank: number;
}, category: string = "general"): NewsArticle {
  const domain = result.host_name || new URL(result.url).hostname;
  const sourceName = domain
    .replace(/^www\./, "")
    .split(".")
    .slice(0, -1)
    .join(".")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: generateId(result.url),
    title: result.name || "Untitled",
    description: result.snippet || "",
    content: result.snippet || "",
    url: result.url,
    image: extractImageFromSnippet(result.snippet),
    source: sourceName,
    sourceIcon: result.favicon || null,
    publishedAt: result.date || new Date().toISOString(),
    category,
  };
}

// High-quality news source domains for image extraction
const NEWS_IMAGE_SOURCES: Record<string, string> = {
  "reuters.com": "Reuters",
  "bbc.com": "BBC News",
  "cnn.com": "CNN",
  "nytimes.com": "The New York Times",
  "theguardian.com": "The Guardian",
  "apnews.com": "Associated Press",
  "aljazeera.com": "Al Jazeera",
  "washingtonpost.com": "Washington Post",
  "cnbc.com": "CNBC",
  "bloomberg.com": "Bloomberg",
  "techcrunch.com": "TechCrunch",
  "theverge.com": "The Verge",
  "wired.com": "Wired",
  "arstechnica.com": "Ars Technica",
  "espn.com": "ESPN",
  "bbc.co.uk": "BBC News",
};

// Seed articles with real-looking images from Unsplash (public domain)
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1504711434969-e33886168d3c?w=800&q=80",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
  "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
];

function assignFallbackImage(article: NewsArticle, index: number): NewsArticle {
  // Try to assign a relevant image based on category
  const categoryImages: Record<string, string[]> = {
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
    world: [
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    ],
    general: [
      "https://images.unsplash.com/photo-1504711434969-e33886168d3c?w=800&q=80",
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80",
    ],
  };

  const images = categoryImages[article.category] || FALLBACK_IMAGES;
  return {
    ...article,
    image: images[index % images.length],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "general";
    const page = parseInt(searchParams.get("page") || "1");

    // Check cache
    const cacheKey = `${category}_${page}`;
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

    const categoryQueries: Record<string, string> = {
      general: "breaking news today world latest headlines 2025",
      world: "world news international global events today 2025",
      technology: "technology news AI artificial intelligence latest 2025",
      business: "business finance economy stock market news today 2025",
      sports: "sports news football basketball tennis latest 2025",
      health: "health news medical research wellness today 2025",
      entertainment: "entertainment movies music celebrity news 2025",
      science: "science space discovery research news 2025",
    };

    const query = categoryQueries[category] || categoryQueries.general;

    const zai = await ZAI.create();
    const results = await zai.functions.invoke("web_search", {
      query,
      num: 20,
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

    // Filter out low-quality results
    const filtered = results.filter(
      (r: { name: string; snippet: string; url: string }) =>
        r.name &&
        r.name.length > 15 &&
        r.snippet &&
        r.snippet.length > 30 &&
        r.url &&
        !r.url.includes("pinterest") &&
        !r.url.includes("facebook") &&
        !r.url.includes("twitter") &&
        !r.url.includes("instagram")
    );

    const articles: NewsArticle[] = filtered
      .slice(0, 15)
      .map((result: Parameters<typeof searchResultToArticle>[0], index: number) =>
        assignFallbackImage(
          searchResultToArticle(result, category),
          index
        )
      );

    // Cache results
    cache.set(cacheKey, { data: articles, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      articles,
      totalResults: articles.length,
      category,
    });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      {
        success: false,
        articles: [],
        totalResults: 0,
        error: "Failed to fetch news",
      },
      { status: 500 }
    );
  }
}
