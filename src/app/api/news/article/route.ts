import { NextRequest, NextResponse } from "next/server";

// ── Cache ────────────────────────────────────────────────────────

const cache = new Map<
  string,
  {
    data: {
      title: string;
      html: string;
      image: string | null;
      publishedTime: string | null;
      author: string | null;
    };
    timestamp: number;
  }
>();
const CACHE_MS = 30 * 60 * 1000; // 30 min cache

// ── Image extraction ─────────────────────────────────────────────

function extractFirstImage(html: string): string | null {
  const ogMatch = html.match(
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
  );
  if (ogMatch?.[1]) return ogMatch[1];
  const twMatch = html.match(
    /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
  );
  if (twMatch?.[1]) return twMatch[1];
  return null;
}

// ── Extract article body from BBC page HTML ──────────────────────

function extractArticleBody(html: string): string {
  // Try multiple selectors that BBC uses for article content
  const patterns = [
    // BBC article blocks
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    // BBC data-component blocks
    /<div[^>]*data-component=["']text-block["'][^>]*>([\s\S]*?)<\/div>/gi,
    // BBC story body
    /<div[^>]*(?:id|class)=["'][^"']*(?:story-body|article-body|main-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  ];

  let body = "";

  // Try article tag first
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    body = articleMatch[1];
  } else {
    // Try main content area
    const mainMatch = html.match(
      /<div[^>]*(?:id|class)=["'][^"']*(?:story-body|article-body|main-content|body-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/i
    );
    if (mainMatch) {
      body = mainMatch[1];
    } else {
      // Fallback: try to get everything between the first <p> after header and footer
      const pContent: string[] = [];
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let pMatch;
      let count = 0;
      while ((pMatch = pRegex.exec(html)) !== null && count < 50) {
        const text = pMatch[1].replace(/<[^>]*>/g, "").trim();
        if (text.length > 40) {
          pContent.push(pMatch[0]);
          count++;
        }
      }
      if (pContent.length >= 3) {
        body = pContent.join("\n");
      }
    }
  }

  return body;
}

// ── Extract title from HTML ──────────────────────────────────────

function extractTitle(html: string): string {
  // Try og:title first
  const ogMatch = html.match(
    /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
  );
  if (ogMatch?.[1]) return ogMatch[1];

  // Try h1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match?.[1]) return h1Match[1].replace(/<[^>]*>/g, "").trim();

  // Try <title> tag
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch?.[1]) return titleMatch[1].replace(/<[^>]*>/g, "").trim();

  return "";
}

// ── Extract author from HTML ─────────────────────────────────────

function extractAuthor(html: string): string | null {
  const authorMatch = html.match(
    /<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i
  );
  if (authorMatch?.[1]) return authorMatch[1];

  // Try byline pattern
  const bylineMatch = html.match(
    /<[^>]*(?:class|data-component)=["'][^"']*(?:byline|author)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i
  );
  if (bylineMatch?.[1]) return bylineMatch[1].replace(/<[^>]*>/g, "").trim();

  return null;
}

// ── Extract published time ───────────────────────────────────────

function extractPublishedTime(html: string): string | null {
  // Try article:published_time
  const timeMatch = html.match(
    /<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i
  );
  if (timeMatch?.[1]) return timeMatch[1];

  // Try datePublished
  const dateMatch = html.match(
    /<meta[^>]*itemprop=["']datePublished["'][^>]*content=["']([^"']+)["']/i
  );
  if (dateMatch?.[1]) return dateMatch[1];

  return null;
}

// ── Aggressive HTML cleaning for article body ────────────────────

// Elements to completely remove (with all their children)
const REMOVE_TAGS = [
  "script",
  "style",
  "noscript",
  "svg",
  "nav",
  "header",
  "footer",
  "aside",
  "form",
  "iframe",
  "button",
  "select",
  "textarea",
  "input",
  "label",
];

// Class/id patterns that indicate non-article content
const REMOVE_SELECTORS = [
  /\bshare\b/i,
  /\bsharing\b/i,
  /\bsocial\b/i,
  /\bfacebook\b/i,
  /\btwitter\b/i,
  /\bwhatsapp\b/i,
  /\bemail-share\b/i,
  /\bsend-to-friend\b/i,
  /\bcopy-link\b/i,
  /\bshare-icon\b/i,
  /\bshare-button\b/i,
  /\bshare-tools\b/i,
  /\bnav\b/i,
  /\bnavigation\b/i,
  /\bmenu\b/i,
  /\bsitemap\b/i,
  /\bbreadcrumb\b/i,
  /\bcookie-banner\b/i,
  /\bconsent\b/i,
  /\bnotification\b/i,
  /\bpromo\b/i,
  /\brelated\b/i,
  /\bmost-read\b/i,
  /\bmost-watched\b/i,
  /\bmore-on\b/i,
  /\byou-might-like\b/i,
  /\brecommended\b/i,
  /\btrending\b/i,
  /\bside\b/i,
  /\bsidebar\b/i,
  /\badvert/i,
  /\bad\b/i,
  /\bsponsor/i,
  /\bcommercial\b/i,
  /\bcomments?\b/i,
  /\bresponse\b/i,
  /\bfeatures-belt\b/i,
  /\bspecial-reports?\b/i,
  /\blive\b/i,
  /\bupdates\b/i,
  /\bnewsletter\b/i,
  /\bsubscribe\b/i,
  /\bsign-up\b/i,
  /\bjoin-us\b/i,
  /\bmember/i,
  /\bskip-link\b/i,
  /\bskip-to\b/i,
  /\boverlay\b/i,
  /\bmodal\b/i,
  /\bpopup\b/i,
  /\btooltip\b/i,
  /\bprint\b/i,
  /\bbanner\b/i,
  /\bbrand\b/i,
  /\bglobal-nav\b/i,
  /\bidentity\b/i,
  /\bhome-link\b/i,
  /\bcorrespondent\b/i,
];

function cleanArticleHtml(rawHtml: string): string {
  let html = rawHtml;

  // 1. Remove unwanted tags completely
  for (const tag of REMOVE_TAGS) {
    html = html.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"), "");
    html = html.replace(new RegExp(`<${tag}[^>]*\\/?>`, "gi"), "");
  }

  // 2. Remove comments
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  // 3. Remove data attributes (tracking)
  html = html.replace(/\s+data-[\w-]+=["'][^"']*["']/gi, "");
  html = html.replace(/\s+data-[\w-]+=\{[^}]*\}/gi, "");

  // 4. Remove elements with matching class/id patterns
  for (const pattern of REMOVE_SELECTORS) {
    html = html.replace(
      new RegExp(
        `<[^>]*(?:class|id)=["'][^"']*(?:${pattern.source})[^"']*["'][^>]*>[\\s\\S]*?<\\/[^>]+>`,
        "gi"
      ),
      ""
    );
  }

  // 5. Remove empty paragraphs and divs
  html = html.replace(/<p[^>]*>\s*(?:&nbsp;|\s)*\s*<\/p>/gi, "");
  html = html.replace(/<div[^>]*>\s*<\/div>/gi, "");
  html = html.replace(/<span[^>]*>\s*<\/span>/gi, "");

  // 6. Remove decorative/separator elements
  html = html.replace(/<hr[^>]*\/?>/gi, "");

  // 7. Remove social/external share links
  html = html.replace(
    /<a[^>]*(?:facebook|twitter|whatsapp|linkedin|pinterest|email|share|reddit|telegram)[^>]*>[\s\S]*?<\/a>/gi,
    ""
  );

  // 8. Clean up image tags - keep src, alt only
  html = html.replace(
    /<img([^>]*?)src=["']([^"']+)["']([^>]*?)\/?>/gi,
    (match, _before, src) => {
      const altMatch = match.match(/alt=["']([^"']+)["']/i);
      const alt = altMatch ? `alt="${altMatch[1]}"` : 'alt=""';
      return `<img src="${src}" ${alt} loading="lazy" />`;
    }
  );

  // 9. Clean up figure/figcaption elements
  html = html.replace(
    /<figure[^>]*>([\s\S]*?)<\/figure>/gi,
    (_, content) => {
      const imgMatch = content.match(/<img[^>]*>/i);
      if (!imgMatch) return "";
      const captionMatch = content.match(
        /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i
      );
      const caption = captionMatch
        ? `<p class="text-sm text-muted-foreground italic mt-1 mb-4">${captionMatch[1].trim()}</p>`
        : "";
      return `<div class="my-6">${imgMatch[0]}${caption}</div>`;
    }
  );

  // 10. Convert paragraphs with strong/b that are section headers
  html = html.replace(
    /<p[^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*<\/p>/gi,
    (_, text) => {
      if (text.length < 100) {
        return `<h3 class="text-lg font-bold mt-6 mb-3">${text}</h3>`;
      }
      return `<p><strong>${text}</strong></p>`;
    }
  );

  // 11. Clean up paragraph spacing
  html = html.replace(/<p[^>]*>\s*/gi, "<p>");
  html = html.replace(/\s*<\/p>/gi, "</p>");

  // 12. Remove excessive nested divs
  let prevHtml = "";
  let maxIterations = 10;
  while (prevHtml !== html && maxIterations > 0) {
    prevHtml = html;
    html = html.replace(
      /<div[^>]*>([\s\S]*?)<\/div>/g,
      (_, content) => {
        if (
          content.trim() &&
          !content.match(/<(?:div|p|h[1-6]|ul|ol|li|table|section|article)/i)
        ) {
          return content.trim();
        }
        return `<div>${content}</div>`;
      }
    );
    maxIterations--;
  }

  // 13. Remove BBC text references
  html = html.replace(/\bBBC\b/g, "SaveitBro News");
  html = html.replace(/\bBritish Broadcasting Corporation\b/g, "SaveitBro News");

  // 14. Remove empty anchors
  html = html.replace(/<a[^>]*>\s*<\/a>/gi, "");
  html = html.replace(/<a[^>]*(?:href=["']#["']|href=["']javascript:[^"']*["'])[^>]*>[\s\S]*?<\/a>/gi, "");

  // 15. Clean up whitespace
  html = html.replace(/\n{3,}/g, "\n\n");
  html = html.replace(/  +/g, " ");

  return html.trim();
}

// ── Main GET handler ─────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const nocache = searchParams.get("nocache") === "true";

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Only allow trusted news URLs
    if (!url.includes("bbc.co.uk") && !url.includes("bbc.com")) {
      return NextResponse.json(
        { success: false, error: "Only supported news articles can be loaded" },
        { status: 400 }
      );
    }

    // Check cache
    if (!nocache) {
      const cached = cache.get(url);
      if (cached && Date.now() - cached.timestamp < CACHE_MS) {
        return NextResponse.json({ success: true, ...cached.data, cached: true });
      }
    }

    // Fetch article HTML directly — works on any hosting platform
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SaveitBroNews/1.0; +https://saveitbro.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      next: { revalidate: 1800 }, // Cache for 30 min
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch the article page" },
        { status: 502 }
      );
    }

    const rawHtml = await response.text();

    if (!rawHtml || rawHtml.length < 200) {
      return NextResponse.json(
        { success: false, error: "Article page returned empty content" },
        { status: 502 }
      );
    }

    // Extract structured data
    const title = extractTitle(rawHtml);
    const author = extractAuthor(rawHtml);
    const publishedTime = extractPublishedTime(rawHtml);
    const image = extractFirstImage(rawHtml);

    // Extract article body
    const bodyHtml = extractArticleBody(rawHtml);

    // Clean the HTML
    const html = cleanArticleHtml(bodyHtml);

    // Store in cache
    const responseData = {
      title,
      html,
      image,
      publishedTime,
      author,
    };
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
