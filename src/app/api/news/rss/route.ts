import { NextRequest, NextResponse } from "next/server";
import type { NewsArticle } from "@/types/news";
import { RSS_FEEDS } from "@/types/news";
import { stripHtml, parseRSSDate } from "@/lib/helpers";

// ── Helpers ──────────────────────────────────────────────────────

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
    const link = linkMatch ? linkMatch[1].trim().replace(/&amp;/g, "&") : "";

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
      // Skip non-article items (sounds, iplayer)
      if (link.includes("/sounds/play") || link.includes("/iplayer/")) continue;
      if (title.length < 15) continue;
      items.push({ title, link, description, pubDate, image });
    }
  }

  return items;
}

function rssItemToArticle(item: RSSItem, feedCategory: string): NewsArticle {
  return {
    id: generateId(item.link),
    title: item.title,
    description: item.description.slice(0, 400),
    content: "",
    url: item.link,
    image: item.image,
    source: "PulseNews",
    sourceIcon: null,
    publishedAt: item.pubDate,
    category: feedCategory,
    author: undefined,
  };
}

// ── Cache ────────────────────────────────────────────────────────

const feedCache = new Map<string, { articles: NewsArticle[]; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000;

// ── Main GET handler ─────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "top-stories";

    if (!RSS_FEEDS[category as keyof typeof RSS_FEEDS]) {
      return NextResponse.json(
        { success: false, articles: [], totalResults: 0, error: "Invalid category" },
        { status: 400 }
      );
    }

    const feedUrl = RSS_FEEDS[category as keyof typeof RSS_FEEDS];

    // Check cache
    const cached = feedCache.get(category);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        articles: cached.articles,
        totalResults: cached.articles.length,
        category,
        cached: true,
      });
    }

    // Fetch RSS feed
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PulseNews/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      console.error(`Failed to fetch RSS feed for ${category}: ${response.status}`);
      return NextResponse.json(
        { success: false, articles: [], totalResults: 0, error: "Failed to fetch feed" },
        { status: 500 }
      );
    }

    const xml = await response.text();
    const items = parseRSSFeed(xml);

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        articles: [],
        totalResults: 0,
        category,
      });
    }

    const articles = items
      .map((item) => rssItemToArticle(item, category))
      .filter((a) => a.title.length > 10);

    feedCache.set(category, { articles, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      articles,
      totalResults: articles.length,
      category,
    });
  } catch (error) {
    console.error("RSS API error:", error);
    return NextResponse.json(
      { success: false, articles: [], totalResults: 0, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
