import { randomUUID } from 'node:crypto';
import type { Article, FeedConfig } from './types';
import { fetchFeed } from './rss';
import { fingerprint, normalizeUrl, tokenSimilarity } from './utils';
import { generateStory, isSameEvent, storySlug } from './ai';
import { getArticleByFingerprint, getArticles, insertArticle } from './db';

function feedConfigs(): FeedConfig[] {
  try { return JSON.parse(process.env.NEWS_FEEDS_JSON || '[]').filter((f: FeedConfig) => f.enabled); }
  catch { throw new Error('NEWS_FEEDS_JSON is not valid JSON'); }
}

export async function runNewsPipeline() {
  if (process.env.DEMO_MODE !== 'false') return { ok: true, mode: 'demo', message: 'Demo mode: external publishing is intentionally disabled.', fetched: 0, published: 0, duplicates: 0, rejected: 0 };
  const feeds = feedConfigs();
  const existing = await getArticles({ limit: 250 });
  let fetched = 0, published = 0, duplicates = 0, rejected = 0;
  const errors: string[] = [];

  for (const cfg of feeds) {
    if (cfg.publicAttributionRequired) { errors.push(`${cfg.id}: skipped because public attribution is required by source configuration.`); continue; }
    try {
      const items = await fetchFeed(cfg);
      fetched += items.length;
      for (const item of items) {
        const fp = fingerprint(item.sourceId, item.guid, normalizeUrl(item.link));
        if (await getArticleByFingerprint(fp)) { duplicates++; continue; }
        const recent = existing.filter(a => Math.abs(new Date(a.publishedAt).getTime() - new Date(item.publishedAt).getTime()) < 48 * 3600_000);
        const exactNear = recent.find(a => tokenSimilarity(a.headline, item.title) >= 0.72);
        if (exactNear) { duplicates++; continue; }
        const semanticCandidates = recent
          .map(a => ({ a, score: tokenSimilarity(`${a.headline} ${a.standfirst}`, `${item.title} ${item.description}`) }))
          .filter(x => x.score >= 0.26)
          .sort((x, y) => y.score - x.score)
          .slice(0, 4);
        let semanticDuplicate = false;
        for (const c of semanticCandidates) {
          if (await isSameEvent(item.title, item.description, c.a.headline, c.a.standfirst)) { semanticDuplicate = true; break; }
        }
        if (semanticDuplicate) { duplicates++; continue; }
        const generated = await generateStory(item);
        if (!generated?.verification.supported || generated.body.length < 280) { rejected++; continue; }
        const id = randomUUID();
        const article: Article = {
          id, slug: storySlug(generated, id), headline: generated.headline, standfirst: generated.standfirst,
          body: generated.body, category: item.category, tags: generated.tags, author: `${item.category} Desk`,
          publishedAt: new Date().toISOString(), modifiedAt: new Date().toISOString(),
          imageUrl: item.imageReuseAllowed && item.imageUrl ? item.imageUrl : `/api/illustration?topic=${encodeURIComponent(generated.tags[0] || item.category)}&kind=${encodeURIComponent(item.category.toLowerCase())}`,
          imageAlt: generated.imageAlt, status: 'published', seoTitle: generated.seoTitle, seoDescription: generated.seoDescription,
          sourceFingerprint: fp, storyCluster: fingerprint(item.title).slice(0, 20),
          provenance: { sourceId: item.sourceId, originalUrl: item.link, originalGuid: item.guid, sourcePublishedAt: item.publishedAt, verificationNotes: generated.verification.notes }
        };
        await insertArticle(article); existing.unshift(article); published++;
      }
    } catch (e: any) { errors.push(`${cfg.id}: ${e?.message || String(e)}`); }
  }
  return { ok: errors.length === 0, fetched, published, duplicates, rejected, errors };
}
