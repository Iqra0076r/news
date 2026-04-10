import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

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
const CACHE_MS = 10 * 60 * 1000; // 10 min cache for fresh content

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
  // Social sharing
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
  // Navigation
  /\bnav\b/i,
  /\bnavigation\b/i,
  /\bmenu\b/i,
  /\bsitemap\b/i,
  /\bbreadcrumb\b/i,
  /\bcookie-banner\b/i,
  /\bconsent\b/i,
  /\bnotification\b/i,
  /\bpromo\b/i,
  // Related/side content
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
  // Interactive features
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
  // Utility
  /\bskip-link\b/i,
  /\bskip-to\b/i,
  /\baccessibility\b/i,
  /\boverlay\b/i,
  /\bmodal\b/i,
  /\bpopup\b/i,
  /\btooltip\b/i,
  /\bprint\b/i,
  /\bbanner\b/i,
  // Footer/header specific
  /\bbrand\b/i,
  /\bglobal-nav\b/i,
  /\bidentity\b/i,
  /\bhome-link\b/i,
  /\bcorrespondent\b/i,
];

// Patterns to remove from element text content
const TEXT_PATTERNS_TO_REMOVE = [
  /\bShare\s+(this|page|article|story)\b/gi,
  /\bShare\b.*?(via|on|with)\b/gi,
  /\bCopy\s+(this|page)\s+link\b/gi,
  /\bMost\s+read\b/gi,
  /\bMore\s+(on|about|from)\b/gi,
  /\bRelated\b.*?\btopic\b/gi,
  /\bWhat\s+you\s+need\s+to\s+know\b/gi,
  /\bKey\s+points?\b/gi,
  /\bRead\s+more\b/gi,
  /\bWas\s+this\s+helpful\?/gi,
  /\bHow\s+to\s+(listen|watch|follow)\b/gi,
  /\bSend\s+us\b/gi,
  /\bTerms?\s+of\s+Use\b/gi,
  /\bPrivacy\b/gi,
  /\bCookie\b/gi,
  /\bAccessibility\b/gi,
  /\bContact\b/gi,
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

  // 7. Remove links that are just social/external share links
  html = html.replace(
    /<a[^>]*(?:facebook|twitter|whatsapp|linkedin|pinterest|email|share|reddit|telegram)[^>]*>[\s\S]*?<\/a>/gi,
    ""
  );

  // 8. Clean up image tags - keep src, alt, width, height only
  html = html.replace(
    /<img([^>]*?)src=["']([^"']+)["']([^>]*?)\/?>/gi,
    (match, before, src, after) => {
      // Extract alt text if present
      const altMatch = match.match(/alt=["']([^"']+)["']/i);
      const alt = altMatch ? `alt="${altMatch[1]}"` : 'alt=""';
      return `<img src="${src}" ${alt} loading="lazy" />`;
    }
  );

  // 9. Clean up figure/figcaption elements
  html = html.replace(
    /<figure[^>]*>([\s\S]*?)<\/figure>/gi,
    (_, content) => {
      // Extract the image
      const imgMatch = content.match(/<img[^>]*>/i);
      if (!imgMatch) return "";
      // Extract figcaption
      const captionMatch = content.match(
        /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i
      );
      const caption = captionMatch
        ? `<p class="text-sm text-muted-foreground italic mt-1 mb-4">${captionMatch[1].trim()}</p>`
        : "";
      return `<div class="my-6">${imgMatch[0]}${caption}</div>`;
    }
  );

  // 10. Convert paragraphs with strong/b tags that are section headers
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
  html = html.replace(/<p[^>]*>\s*/gi, '<p>');
  html = html.replace(/\s*<\/p>/gi, "</p>");

  // 12. Remove excessive nested divs - unwrap content from single-child divs
  let prevHtml = "";
  let maxIterations = 10;
  while (prevHtml !== html && maxIterations > 0) {
    prevHtml = html;
    html = html.replace(
      /<div[^>]*>([\s\S]*?)<\/div>/g,
      (_, content) => {
        // Only unwrap if the div doesn't have significant attributes
        // and doesn't contain block-level children
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

  // 13. Remove leftover BBC text references from content
  html = html.replace(/\bBBC\b/g, "PulseNews");
  html = html.replace(/\bBritish Broadcasting Corporation\b/g, "PulseNews");

  // 14. Remove empty anchors
  html = html.replace(/<a[^>]*>\s*<\/a>/gi, "");

  // 15. Remove remaining links that are just "#" or javascript:
  html = html.replace(/<a[^>]*(?:href=["']#["']|href=["']javascript:[^"']*["'])[^>]*>[\s\S]*?<\/a>/gi, "");

  // 16. Clean up whitespace
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

    // Check cache (unless nocache)
    if (!nocache) {
      const cached = cache.get(url);
      if (cached && Date.now() - cached.timestamp < CACHE_MS) {
        return NextResponse.json({ success: true, ...cached.data, cached: true });
      }
    }

    const zai = await ZAI.create();
    const result = await zai.functions.invoke("page_reader", { url });

    if (!result || !result.data) {
      return NextResponse.json(
        { success: false, error: "Failed to read article" },
        { status: 500 }
      );
    }

    const data = result.data as {
      title?: string;
      html?: string;
      publishedTime?: string;
    };

    const title = data.title || "";
    const rawHtml = data.html || "";

    // Extract hero image
    const image = extractFirstImage(rawHtml);

    // Extract author
    let author: string | null = null;
    const authorMatch = rawHtml.match(
      /<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i
    );
    if (authorMatch) author = authorMatch[1];

    // Clean the HTML aggressively
    const html = cleanArticleHtml(rawHtml);

    // Store in cache
    const responseData = {
      title,
      html,
      image,
      publishedTime: data.publishedTime || null,
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
