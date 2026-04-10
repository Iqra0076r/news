import { NextRequest, NextResponse } from "next/server";
import type { NewsArticle } from "@/types/news";
import { RSS_FEEDS } from "@/types/news";
import { stripHtml, parseRSSDate } from "@/lib/helpers";

function generateId(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image: string | null;
}

function parseRSSFeed(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ||
      itemXml.match(/<title>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? stripHtml(titleMatch[1]).trim() : "";

    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
    const link = linkMatch ? linkMatch[1].trim() : "";

    const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) ||
      itemXml.match(/<description>([\s\S]*?)<\/description>/i);
    const description = descMatch ? stripHtml(descMatch[1]).trim() : "";

    const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
    const pubDate = dateMatch ? parseRSSDate(dateMatch[1].trim()) : new Date().toISOString();

    let image: string | null = null;
    const thumbMatch = itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i);
    if (thumbMatch) image = thumbMatch[1];
    if (!image) {
      const mediaMatch = itemXml.match(/<media:content[^>]*url=["']([^"']+)["']/i);
      if (mediaMatch) image = mediaMatch[1];
    }
    if (!image) {
      const enclosureMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/i);
      if (enclosureMatch) image = enclosureMatch[1];
    }

    if (title && link) {
      items.push({ title, link, description, pubDate, image });
    }
  }

  return items;
}

const searchCache = new Map<string, { articles: NewsArticle[]; timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Query required", articles: [], totalResults: 0 },
        { status: 400 }
      );
    }

    const normalizedQuery = query.trim().toLowerCase();

    // Check cache
    const cacheKey = `search:${normalizedQuery}`;
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        articles: cached.articles,
        totalResults: cached.articles.length,
        query,
        cached: true,
      });
    }

    // Search across top-stories, world, uk, business, technology, science, sport feeds
    const feedKeys: (keyof typeof RSS_FEEDS)[] = [
      "top-stories", "world", "uk", "business", "technology", "science", "sport",
    ];

    const allItems: (RSSItem & { feedCategory: string })[] = [];

    // Fetch feeds in parallel
    const feedPromises = feedKeys.map(async (key) => {
      try {
        const res = await fetch(RSS_FEEDS[key], {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; SaveitBroNews/1.0)",
            Accept: "application/rss+xml, application/xml, text/xml, */*",
          },
        });
        if (!res.ok) return [];
        const xml = await res.text();
        const items = parseRSSFeed(xml);
        return items.map((item) => ({ ...item, feedCategory: key }));
      } catch {
        return [];
      }
    });

    const results = await Promise.allSettled(feedPromises);

    for (const result of results) {
      if (result.status === "fulfilled") {
        allItems.push(...result.value);
      }
    }

    // Filter by query (case-insensitive match on title and description)
    const queryWords = normalizedQuery.split(/\s+/);
    const matchedItems = allItems.filter((item) => {
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const combined = `${titleLower} ${descLower}`;
      return queryWords.some((word) => combined.includes(word));
    });

    // Deduplicate by link
    const seen = new Set<string>();
    const uniqueItems = matchedItems.filter((item) => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    });

    // Sort by date (newest first)
    uniqueItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    const articles: NewsArticle[] = uniqueItems.slice(0, 20).map((item) => ({
      id: generateId(item.link),
      title: item.title,
      description: item.description.slice(0, 400),
      content: "",
      url: item.link,
      image: item.image,
      source: "SaveitBro News",
      sourceIcon: null,
      publishedAt: item.pubDate,
      category: item.feedCategory,
      author: undefined,
    }));

    searchCache.set(cacheKey, { articles, timestamp: Date.now() });

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
