import { NextRequest, NextResponse } from "next/server";

// ── Vercel config ────────────────────────────────────────────────
export const maxDuration = 30;
export const dynamic = "force-dynamic";

// ── CORS proxies for fetching BBC (which blocks cloud IPs) ──────
const PROXY_URLS = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

// ── In-memory cache ──────────────────────────────────────────────
const cache = new Map<
  string,
  {
    data: {
      id: string;
      title: string;
      url: string;
      description: string;
      image: string | null;
      publishedAt: string;
      category: string;
      source: string;
      sourceIcon: string | null;
      author: string | null;
      content: string;
    };
    timestamp: number;
  }
>();
const CACHE_MS = 30 * 60 * 1000;

// ── Helper to generate a deterministic article ID from URL ──────
function generateId(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// ── Fetch HTML with multiple fallback strategies ────────────────
async function fetchHtml(url: string): Promise<{ html: string } | null> {
  // Strategy 1: Direct fetch
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 500) return { html: text };
    }
  } catch {
    // fall through
  }

  // Strategy 2: CORS proxies
  for (const makeProxyUrl of PROXY_URLS) {
    try {
      const proxyUrl = makeProxyUrl(url);
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(proxyUrl, {
        signal: ctrl.signal,
        headers: { Accept: "text/html,*/*" },
      });
      clearTimeout(timer);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 500) return { html: text };
      }
    } catch {
      // try next proxy
    }
  }

  return null;
}

// ── Extraction helpers ──────────────────────────────────────────
function extractImage(html: string): string | null {
  const og = html.match(
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
  );
  if (og?.[1]) return og[1];
  const tw = html.match(
    /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
  );
  return tw?.[1] || null;
}

function extractTitle(html: string): string {
  const og = html.match(
    /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
  );
  if (og?.[1]) return og[1];
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1?.[1]) return h1[1].replace(/<[^>]*>/g, "").trim();
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return t?.[1]?.replace(/<[^>]*>/g, "").trim() || "";
}

function extractDescription(html: string): string {
  const og = html.match(
    /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
  );
  if (og?.[1]) return og[1];
  const meta = html.match(
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
  );
  return meta?.[1] || "";
}

function extractAuthor(html: string): string | null {
  const m = html.match(
    /<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i
  );
  if (m?.[1]) return m[1];
  const b = html.match(
    /<[^>]*(?:class|data-component)=["'][^"']*(?:byline|author)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i
  );
  return b?.[1]?.replace(/<[^>]*>/g, "").trim() || null;
}

function extractTime(html: string): string | null {
  const m = html.match(
    /<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i
  );
  if (m?.[1]) return m[1];
  const d = html.match(
    /<meta[^>]*itemprop=["']datePublished["'][^>]*content=["']([^"']+)["']/i
  );
  return d?.[1] || null;
}

function extractBody(html: string): string {
  const article = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (article) return article[1];
  const main = html.match(
    /<div[^>]*(?:id|class)=["'][^"']*(?:story-body|article-body|main-content|body-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/i
  );
  if (main) return main[1];
  const ps: string[] = [];
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  let c = 0;
  while ((m = re.exec(html)) !== null && c < 50) {
    const txt = m[1].replace(/<[^>]*>/g, "").trim();
    if (txt.length > 40) {
      ps.push(m[0]);
      c++;
    }
  }
  return ps.length >= 3 ? ps.join("\n") : "";
}

// ── HD image upgrade ────────────────────────────────────────────
function upgradeToHD(url: string): string {
  if (!url) return url;
  let hd = url;
  hd = hd.replace(/\/ace\/standard\/\d{2,4}\//i, "/ace/standard/1200/");
  hd = hd.replace(/\/(news|wwhp)\/\d{2,4}\//i, "/$1/1200/");
  hd = hd.replace(
    /\/(news|wwhp)\/\d{2,4}x\d{2,4}\//i,
    "/$1/1200x675/"
  );
  if (hd === url && url.includes("bbci.co.uk")) {
    hd = url.replace(/[?&]width=\d+/i, "?width=1200");
  }
  return hd;
}

// ── Detect category from URL path ───────────────────────────────
function detectCategory(url: string): string {
  const lower = url.toLowerCase();
  if (/\/sport\/football/i.test(lower)) return "football";
  if (/\/sport\/cricket/i.test(lower)) return "cricket";
  if (/\/sport/i.test(lower)) return "sport";
  if (/\/technology/i.test(lower) || /\/tech/i.test(lower)) return "technology";
  if (/\/business/i.test(lower)) return "business";
  if (/\/science_and_environment/i.test(lower) || /\/science/i.test(lower))
    return "science";
  if (/\/entertainment_and_arts/i.test(lower) || /\/entertainment/i.test(lower))
    return "entertainment";
  if (/\/world\/asia/i.test(lower)) return "asia";
  if (/\/world\/middle_east/i.test(lower)) return "middle-east";
  if (/\/world\/africa/i.test(lower)) return "africa";
  if (/\/world/i.test(lower)) return "world";
  if (/\/uk/i.test(lower)) return "uk";
  return "top-stories";
}

// ── Main handler ────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL parameter is required" },
        { status: 400 }
      );
    }

    if (!url.includes("bbc.co.uk") && !url.includes("bbc.com")) {
      return NextResponse.json(
        { success: false, error: "Only supported news articles can be loaded" },
        { status: 400 }
      );
    }

    // Check cache
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_MS) {
      return NextResponse.json({
        success: true,
        article: cached.data,
        cached: true,
      });
    }

    // Fetch the article HTML
    const result = await fetchHtml(url);
    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not reach the article. It may have been removed or is temporarily unavailable.",
        },
        { status: 502 }
      );
    }

    const rawHtml = result.html;

    // Extract metadata
    const title = extractTitle(rawHtml);
    const description = extractDescription(rawHtml);
    const author = extractAuthor(rawHtml);
    const publishedTime = extractTime(rawHtml);
    let image = extractImage(rawHtml);
    if (image) image = upgradeToHD(image);

    const bodyHtml = extractBody(rawHtml);

    const category = detectCategory(url);

    const articleData = {
      id: generateId(url),
      title: title || "Untitled Article",
      url,
      description: description.slice(0, 400),
      image: image || null,
      publishedAt: publishedTime || new Date().toISOString(),
      category,
      source: "SaveitBro News",
      sourceIcon: null,
      author: author || null,
      content: bodyHtml || "",
    };

    cache.set(url, { data: articleData, timestamp: Date.now() });

    return NextResponse.json({
      success: true,
      article: articleData,
    });
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to look up article" },
      { status: 500 }
    );
  }
}
