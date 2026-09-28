import type { FeedConfig, FeedItem } from './types';
import { normalizeUrl, stripHtml } from './utils';

function first(block: string, tags: string[]) {
  for (const tag of tags) {
    const escaped = tag.replace(':', '\\:');
    const rx = new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i');
    const m = block.match(rx);
    if (m?.[1]) return stripHtml(m[1]);
  }
  return '';
}

function attr(block: string, tag: string, attribute: string) {
  const escaped = tag.replace(':', '\\:');
  const rx = new RegExp(`<${escaped}[^>]*\\s${attribute}=["']([^"']+)["'][^>]*>`, 'i');
  return block.match(rx)?.[1] || '';
}

export async function fetchFeed(config: FeedConfig): Promise<FeedItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(config.url, { signal: controller.signal, headers: { 'User-Agent': 'AtlasNewsroomBot/1.0 (+news-ingestion; respectful feed reader)' }, cache: 'no-store' });
    if (!res.ok) throw new Error(`Feed ${config.id} returned ${res.status}`);
    const xml = await res.text();
    const blocks = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)].map(m => m[2]);
    return blocks.slice(0, 80).map((block, index) => {
      const title = first(block, ['title']);
      const linkText = first(block, ['link']);
      const linkHref = attr(block, 'link', 'href');
      const link = normalizeUrl(linkHref || linkText);
      const description = first(block, ['description', 'summary', 'content:encoded', 'content']);
      const guid = first(block, ['guid', 'id']) || link || `${config.id}-${index}-${title}`;
      const dateRaw = first(block, ['pubDate', 'published', 'updated']);
      const image = attr(block, 'media:content', 'url') || attr(block, 'media:thumbnail', 'url') || attr(block, 'enclosure', 'url');
      return {
        guid, link, title, description,
        publishedAt: dateRaw && !Number.isNaN(Date.parse(dateRaw)) ? new Date(dateRaw).toISOString() : new Date().toISOString(),
        imageUrl: image || undefined,
        sourceId: config.id,
        category: config.category,
        imageReuseAllowed: config.imageReuseAllowed,
        publicAttributionRequired: config.publicAttributionRequired
      };
    }).filter(i => i.title && i.link && i.description);
  } finally { clearTimeout(timer); }
}
