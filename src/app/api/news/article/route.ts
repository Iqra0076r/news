import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

function extractFirstImage(html: string): string | null {
  const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (ogMatch && ogMatch[1]) return ogMatch[1];
  const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
  if (twMatch && twMatch[1]) return twMatch[1];
  const imgMatch = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/i);
  if (imgMatch && imgMatch[1]) return imgMatch[1];
  return null;
}

const cache = new Map<string, { data: { title: string; html: string; image: string | null; publishedTime: string | null; author: string | null }; timestamp: number }>();
const CACHE_MS = 30 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ success: false, error: "URL parameter is required" }, { status: 400 });
    }

    // Only allow BBC URLs
    if (!url.includes("bbc.co.uk") && !url.includes("bbc.com")) {
      return NextResponse.json({ success: false, error: "Only BBC articles are supported" }, { status: 400 });
    }

    // Check cache
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_MS) {
      return NextResponse.json({ success: true, ...cached.data, cached: true });
    }

    const zai = await ZAI.create();
    const result = await zai.functions.invoke("page_reader", { url });

    if (!result || !result.data) {
      return NextResponse.json({ success: false, error: "Failed to read article" }, { status: 500 });
    }

    const data = result.data as { title?: string; html?: string; publishedTime?: string };
    const title = data.title || "";
    const rawHtml = data.html || "";
    const image = extractFirstImage(rawHtml);
    const publishedTime = data.publishedTime || null;

    // Extract author if available
    let author: string | null = null;
    const authorMatch = rawHtml.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i);
    if (authorMatch) author = authorMatch[1];

    // Clean HTML: remove scripts, styles, navigation, ads
    const html = rawHtml
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim();

    // Store in cache
    const responseData = { title, html, image, publishedTime, author };
    cache.set(url, { data: responseData, timestamp: Date.now() });

    return NextResponse.json({ success: true, ...responseData });
  } catch (error) {
    console.error("Article read error:", error);
    return NextResponse.json({ success: false, error: "Failed to read article content" }, { status: 500 });
  }
}
