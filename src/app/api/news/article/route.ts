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
  { data: { title: string; html: string; image: string | null; publishedTime: string | null; author: string | null }; timestamp: number }
>();
const CACHE_MS = 30 * 60 * 1000;

// ── Fetch with multiple fallback strategies ──────────────────────

async function fetchHtml(url: string): Promise<{ html: string; source: string } | null> {
  // Strategy 1: Direct fetch (works from Z.ai sandbox, some ISPs)
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 500) return { html: text, source: "direct" };
    }
  } catch (e) {
    console.log("Direct fetch failed:", e instanceof Error ? e.message : "unknown");
  }

  // Strategy 2: Try CORS proxies
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
        if (text && text.length > 500) return { html: text, source: "proxy" };
      }
    } catch (e) {
      console.log("Proxy fetch failed:", e instanceof Error ? e.message : "unknown");
    }
  }

  return null;
}

// ── Extraction helpers ───────────────────────────────────────────

function extractImage(html: string): string | null {
  const og = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (og?.[1]) return og[1];
  const tw = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
  return tw?.[1] || null;
}

function extractTitle(html: string): string {
  const og = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (og?.[1]) return og[1];
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1?.[1]) return h1[1].replace(/<[^>]*>/g, "").trim();
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return t?.[1]?.replace(/<[^>]*>/g, "").trim() || "";
}

function extractAuthor(html: string): string | null {
  const m = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i);
  if (m?.[1]) return m[1];
  const b = html.match(/<[^>]*(?:class|data-component)=["'][^"']*(?:byline|author)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i);
  return b?.[1]?.replace(/<[^>]*>/g, "").trim() || null;
}

function extractTime(html: string): string | null {
  const m = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i);
  if (m?.[1]) return m[1];
  const d = html.match(/<meta[^>]*itemprop=["']datePublished["'][^>]*content=["']([^"']+)["']/i);
  return d?.[1] || null;
}

function extractBody(html: string): string {
  // Try <article> tag
  const article = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (article) return article[1];

  // Try story-body / article-body div
  const main = html.match(/<div[^>]*(?:id|class)=["'][^"']*(?:story-body|article-body|main-content|body-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);
  if (main) return main[1];

  // Fallback: collect substantial paragraphs
  const ps: string[] = [];
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m; let c = 0;
  while ((m = re.exec(html)) !== null && c < 50) {
    const txt = m[1].replace(/<[^>]*>/g, "").trim();
    if (txt.length > 40) { ps.push(m[0]); c++; }
  }
  return ps.length >= 3 ? ps.join("\n") : "";
}

// ── HTML cleaning ────────────────────────────────────────────────

const REMOVE_TAGS = ["script","style","noscript","svg","nav","header","footer","aside","form","iframe","button","select","textarea","input","label"];

const REMOVE_PATTERNS = [
  /\bshare\b/i,/\bsharing\b/i,/\bsocial\b/i,/\bfacebook\b/i,/\btwitter\b/i,
  /\bwhatsapp\b/i,/\bemail-share\b/i,/\bsend-to-friend\b/i,/\bcopy-link\b/i,
  /\bshare-icon\b/i,/\bshare-button\b/i,/\bshare-tools\b/i,/\bnav\b/i,
  /\bnavigation\b/i,/\bmenu\b/i,/\bsitemap\b/i,/\bbreadcrumb\b/i,
  /\bcookie-banner\b/i,/\bconsent\b/i,/\bnotification\b/i,/\bpromo\b/i,
  /\brelated\b/i,/\bmost-read\b/i,/\bmost-watched\b/i,/\bmore-on\b/i,
  /\byou-might-like\b/i,/\brecommended\b/i,/\btrending\b/i,/\bside\b/i,
  /\bsidebar\b/i,/\badvert/i,/\bad\b/i,/\bsponsor/i,/\bcommercial\b/i,
  /\bcomments?\b/i,/\bresponse\b/i,/\bfeatures-belt\b/i,/\bspecial-reports?\b/i,
  /\blive\b/i,/\bupdates\b/i,/\bnewsletter\b/i,/\bsubscribe\b/i,
  /\bsign-up\b/i,/\bjoin-us\b/i,/\bmember/i,/\bskip-link\b/i,/\bskip-to\b/i,
  /\boverlay\b/i,/\bmodal\b/i,/\bpopup\b/i,/\btooltip\b/i,/\bprint\b/i,
  /\bbanner\b/i,/\bbrand\b/i,/\bglobal-nav\b/i,/\bidentity\b/i,/\bhome-link\b/i,
  /\bcorrespondent\b/i,
];

function cleanHtml(raw: string): string {
  let h = raw;
  for (const tag of REMOVE_TAGS) {
    h = h.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"), "");
    h = h.replace(new RegExp(`<${tag}[^>]*\\/?>`, "gi"), "");
  }
  h = h.replace(/<!--[\s\S]*?-->/g, "");
  h = h.replace(/\s+data-[\w-]+=["'][^"']*["']/gi, "");
  h = h.replace(/\s+data-[\w-]+=\{[^}]*\}/gi, "");
  for (const p of REMOVE_PATTERNS) {
    h = h.replace(new RegExp(`<[^>]*(?:class|id)=["'][^"']*(?:${p.source})[^"']*["'][^>]*>[\\s\\S]*?<\\/[^>]+>`, "gi"), "");
  }
  h = h.replace(/<p[^>]*>\s*(?:&nbsp;|\s)*\s*<\/p>/gi, "");
  h = h.replace(/<div[^>]*>\s*<\/div>/gi, "");
  h = h.replace(/<span[^>]*>\s*<\/span>/gi, "");
  h = h.replace(/<hr[^>]*\/?>/gi, "");
  h = h.replace(/<a[^>]*(?:facebook|twitter|whatsapp|linkedin|pinterest|email|share|reddit|telegram)[^>]*>[\s\S]*?<\/a>/gi, "");
  h = h.replace(/<img([^>]*?)src=["']([^"']+)["']([^>]*?)\/?>/gi, (_, __, src) => {
    const alt = _?.match(/alt=["']([^"']+)["']/i);
    return `<img src="${src}" ${alt ? `alt="${alt[1]}"` : 'alt=""'} loading="lazy" />`;
  });
  h = h.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_, c) => {
    const img = c.match(/<img[^>]*>/i);
    if (!img) return "";
    const cap = c.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    return `<div class="my-6">${img[0]}${cap ? `<p class="text-sm text-muted-foreground italic mt-1 mb-4">${cap[1].trim()}</p>` : ""}</div>`;
  });
  h = h.replace(/<p[^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*<\/p>/gi, (_, t) =>
    t.length < 100 ? `<h3 class="text-lg font-bold mt-6 mb-3">${t}</h3>` : `<p><strong>${t}</strong></p>`
  );
  h = h.replace(/<p[^>]*>\s*/gi, "<p>");
  h = h.replace(/\s*<\/p>/gi, "</p>");
  let prev = ""; let max = 10;
  while (prev !== h && max-- > 0) {
    prev = h;
    h = h.replace(/<div[^>]*>([\s\S]*?)<\/div>/g, (_, c) =>
      c.trim() && !c.match(/<(?:div|p|h[1-6]|ul|ol|li|table|section|article)/i) ? c.trim() : `<div>${c}</div>`
    );
  }
  h = h.replace(/\bBBC\b/g, "SaveitBro News");
  h = h.replace(/\bBritish Broadcasting Corporation\b/g, "SaveitBro News");
  h = h.replace(/<a[^>]*>\s*<\/a>/gi, "");
  h = h.replace(/<a[^>]*(?:href=["']#["']|href=["']javascript:[^"']*["'])[^>]*>[\s\S]*?<\/a>/gi, "");
  h = h.replace(/\n{3,}/g, "\n\n").replace(/  +/g, " ");
  return h.trim();
}

// ── Main handler ─────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const nocache = searchParams.get("nocache") === "true";

    if (!url) {
      return NextResponse.json({ success: false, error: "URL parameter is required" }, { status: 400 });
    }
    if (!url.includes("bbc.co.uk") && !url.includes("bbc.com")) {
      return NextResponse.json({ success: false, error: "Only supported news articles can be loaded" }, { status: 400 });
    }

    // Check cache
    if (!nocache) {
      const cached = cache.get(url);
      if (cached && Date.now() - cached.timestamp < CACHE_MS) {
        return NextResponse.json({ success: true, ...cached.data, cached: true });
      }
    }

    // Fetch HTML with fallback strategies
    const result = await fetchHtml(url);
    if (!result) {
      return NextResponse.json(
        { success: false, error: "Could not reach the article. Please try the 'Read Original' button to open it directly." },
        { status: 502 }
      );
    }

    const rawHtml = result.html;

    // Extract and clean
    const title = extractTitle(rawHtml);
    const author = extractAuthor(rawHtml);
    const publishedTime = extractTime(rawHtml);
    const image = extractImage(rawHtml);
    const bodyHtml = extractBody(rawHtml);
    const html = cleanHtml(bodyHtml);

    const responseData = { title, html, image, publishedTime, author };
    cache.set(url, { data: responseData, timestamp: Date.now() });

    return NextResponse.json({ success: true, ...responseData });
  } catch (error) {
    console.error("Article read error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read article content" },
      { status: 500 }
    );
  }
}
