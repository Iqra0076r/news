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

/**
 * Upgrade a BBC image URL to HD resolution.
 * BBC RSS feeds typically return small thumbnails (240/320/480px).
 * We rewrite the width segment to get full HD (1200px) images.
 *
 * Patterns handled:
 *   https://ichef.bbci.co.uk/news/{width}/cpsprodpb/{hash}/image.jpg
 *   https://ichef.bbci.co.uk/wwhp/{width}/cpsprodpb/{hash}/image.jpg
 *   https://ichef.bbci.co.uk/news/{width}x{height}/cpsprodpb/{hash}/image.jpg
 *   https://c.files.bbci.co.uk/{path} (rare, leave as-is)
 */
function upgradeToHD(url: string): string {
  if (!url) return url;

  let hd = url;

  // Pattern 1: /ace/standard/{width}/ — BBC ace CDN, replace width with 1200
  hd = hd.replace(
    /\/ace\/standard\/\d{2,4}\//i,
    "/ace/standard/1200/"
  );

  // Pattern 2: /news/{width}/ or /wwhp/{width}/ — older BBC CDN pattern
  hd = hd.replace(
    /\/(news|wwhp)\/\d{2,4}\//i,
    "/$1/1200/"
  );

  // Pattern 3: /news/{width}x{height}/ — replace with 1200x675 (16:9 HD)
  hd = hd.replace(
    /\/(news|wwhp)\/\d{2,4}x\d{2,4}\//i,
    "/$1/1200x675/"
  );

  // Pattern 4: query param like ?width=320
  if (hd === url && url.includes("bbci.co.uk")) {
    hd = url.replace(/[?&]width=\d+/i, "?width=1200");
  }

  return hd;
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

    // Upgrade to HD resolution
    if (image) {
      image = upgradeToHD(image);
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

// Category-specific URL patterns to EXCLUDE from top-stories
// Only general headline news should appear in top stories
const TOP_STORIES_EXCLUDE_PATTERNS = [
  /\/technology\//i,
  /\/tech\//i,
  /\/business\//i,
  /\/sport\//i,
  /\/sports\//i,
  /\/football\//i,
  /\/cricket\//i,
  /\/science_and_environment\//i,
  /\/science\//i,
  /\/entertainment_and_arts\//i,
  /\/entertainment\//i,
  /\/arts\//i,
  /\/music\//i,
  /\/gaming\//i,
  /\/travel\//i,
  /\/food\//i,
  /\/lifestyle\//i,
];

function isTopStoryCandidate(url: string): boolean {
  // Include the article if it does NOT match any category-specific pattern
  return !TOP_STORIES_EXCLUDE_PATTERNS.some((pattern) => pattern.test(url));
}

function rssItemToArticle(item: RSSItem, feedCategory: string): NewsArticle {
  return {
    id: generateId(item.link),
    title: item.title,
    description: item.description.slice(0, 400),
    content: "",
    url: item.link,
    image: item.image,
    source: "SaveitBro News",
    sourceIcon: null,
    publishedAt: item.pubDate,
    category: feedCategory,
    author: undefined,
  };
}

// ── Cache ────────────────────────────────────────────────────────

const feedCache = new Map<string, { articles: NewsArticle[]; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// ── Main GET handler ─────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "top-stories";
    const nocache = searchParams.get("nocache") === "true";

    if (!RSS_FEEDS[category as keyof typeof RSS_FEEDS]) {
      return NextResponse.json(
        { success: false, articles: [], totalResults: 0, error: "Invalid category" },
        { status: 400 }
      );
    }

    // Check cache (unless nocache requested)
    if (!nocache) {
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
    }

    const feedUrl = RSS_FEEDS[category as keyof typeof RSS_FEEDS];

    // Fetch RSS feed
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SaveitBroNews/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
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

    let articles = items
      .map((item) => rssItemToArticle(item, category))
      .filter((a) => a.title.length > 10)
      .filter((a) => category !== "top-stories" || isTopStoryCandidate(a.url));

    // Sort newest first by publishedAt
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    feedCache.set(category, { articles, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      articles,
      totalResults: articles.length,
      category,
      cached: false,
    });
  } catch (error) {
    console.error("RSS API error:", error);
    return NextResponse.json(
      { success: false, articles: [], totalResults: 0, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
