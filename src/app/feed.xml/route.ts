import { NextResponse } from "next/server";

// ── Constants ──────────────────────────────────────────────────────

const BBC_TOP_STORIES_URL = "http://feeds.bbci.co.uk/news/rss.xml";

// ── Regex Helpers ──────────────────────────────────────────────────

/**
 * Escape text for safe embedding in XML content.
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Strip all HTML tags from a string.
 */
function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

/**
 * Upgrade BBC image URLs from low-res thumbnails to HD (1200px).
 * Pattern: /ace/standard/240/ → /ace/standard/1200/
 */
function upgradeToHD(url: string): string {
  if (!url) return url;
  let hd = url;
  hd = hd.replace(/\/ace\/standard\/\d{2,4}\//i, "/ace/standard/1200/");
  hd = hd.replace(/\/(news|wwhp)\/\d{2,4}\//i, "/$1/1200/");
  hd = hd.replace(/\/(news|wwhp)\/\d{2,4}x\d{2,4}\//i, "/$1/1200x675/");
  if (hd === url && url.includes("bbci.co.uk")) {
    hd = url.replace(/[?&]width=\d+/i, "?width=1200");
  }
  return hd;
}

/**
 * Extract the value of a simple XML tag, handling both CDATA and plain text.
 */
function extractTag(xml: string, tag: string): string {
  // Try CDATA first
  const cdataRegex = new RegExp(
    `<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`,
    "i"
  );
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Plain text fallback
  const plainRegex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i");
  const plainMatch = xml.match(plainRegex);
  return plainMatch ? plainMatch[1].trim() : "";
}

/**
 * Extract the URL from a media:thumbnail or media:content tag.
 */
function extractMediaUrl(xml: string): string | null {
  // <media:thumbnail url="..." />
  const thumbRegex = /<media:thumbnail[^>]*url=["']([^"']+)["']/i;
  const thumbMatch = xml.match(thumbRegex);
  if (thumbMatch) return thumbMatch[1];

  // <media:content url="..." />
  const contentRegex = /<media:content[^>]*url=["']([^"']+)["']/i;
  const contentMatch = xml.match(contentRegex);
  if (contentMatch) return contentMatch[1];

  // <enclosure url="...type="image/..." />
  const enclosureRegex =
    /<enclosure[^>]*url=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/i;
  const enclosureMatch = xml.match(enclosureRegex);
  if (enclosureMatch) return enclosureMatch[1];

  return null;
}

// ── RSS Parsing ────────────────────────────────────────────────────

interface ParsedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl: string | null;
}

function parseRSSItems(xml: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = stripHtml(extractTag(itemXml, "title"));
    const link = extractTag(itemXml, "link").replace(/&amp;/g, "&");
    const rawDescription = extractTag(itemXml, "description");
    const description = stripHtml(rawDescription);
    const pubDate = extractTag(itemXml, "pubDate");

    let imageUrl = extractMediaUrl(itemXml);
    if (imageUrl) {
      imageUrl = upgradeToHD(imageUrl);
    }

    if (title && link) {
      items.push({ title, link, description, pubDate, imageUrl });
    }
  }

  return items;
}

// ── XML Builder ────────────────────────────────────────────────────

function buildRssXml(items: ParsedItem[]): string {
  const now = new Date().toUTCString();
  const siteUrl = "https://saveitbro.com";

  const itemXml = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${escapeXml(item.pubDate)}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>${
        item.imageUrl
          ? `\n      <media:content url="${escapeXml(item.imageUrl)}" medium="image" />`
          : ""
      }
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
>
  <channel>
    <title>SaveitBro News</title>
    <link>${siteUrl}</link>
    <description>Real-time breaking news from around the world</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <ttl>10</ttl>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${itemXml}
  </channel>
</rss>`;
}

// ── GET Handler ────────────────────────────────────────────────────

export async function GET() {
  try {
    const response = await fetch(BBC_TOP_STORIES_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SaveitBroNews/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `feed.xml: Failed to fetch BBC RSS — ${response.status}`
      );
      return new NextResponse(
        buildRssXml([]),
        {
          status: 200,
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
          },
        }
      );
    }

    const xml = await response.text();
    const items = parseRSSItems(xml);
    const rssXml = buildRssXml(items);

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("feed.xml: Error generating RSS feed:", error);
    return new NextResponse(buildRssXml([]), {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control":
          "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
      },
    });
  }
}
