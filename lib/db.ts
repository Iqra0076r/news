import { demoArticles } from './demo';
import type { Article } from './types';

const demo = process.env.DEMO_MODE !== 'false';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function supabase(path: string, init: RequestInit = {}) {
  if (!url || !key) throw new Error('Supabase is not configured. Set DEMO_MODE=true or configure Supabase.');
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(init.headers || {}) },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`Supabase request failed ${res.status}: ${await res.text()}`);
  if (res.status === 204) return null;
  return res.json();
}

export async function getArticles(opts: { category?: string; query?: string; limit?: number; allStatuses?: boolean } = {}): Promise<Article[]> {
  if (demo) {
    let rows = [...demoArticles];
    if (opts.category) rows = rows.filter(a => a.category.toLowerCase() === opts.category!.toLowerCase());
    if (opts.query) { const q = opts.query.toLowerCase(); rows = rows.filter(a => `${a.headline} ${a.standfirst} ${a.body} ${a.tags.join(' ')}`.toLowerCase().includes(q)); }
    return rows.slice(0, opts.limit || 50);
  }
  const params = new URLSearchParams();
  params.set('select', '*');
  params.set('order', 'published_at.desc');
  params.set('limit', String(opts.limit || 50));
  if (!opts.allStatuses) params.set('status', 'in.(published,updated)');
  if (opts.category) params.set('category', `eq.${opts.category}`);
  if (opts.query) params.set('or', `(headline.ilike.*${opts.query}*,standfirst.ilike.*${opts.query}*,body.ilike.*${opts.query}*)`);
  const rows = await supabase(`articles?${params}`);
  return (rows || []).map(fromRow);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (demo) return demoArticles.find(a => a.slug === slug) || null;
  const rows = await supabase(`articles?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows?.[0] ? fromRow(rows[0]) : null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (demo) return demoArticles.find(a => a.id === id) || null;
  const rows = await supabase(`articles?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
  return rows?.[0] ? fromRow(rows[0]) : null;
}

export async function updateArticleFields(id: string, fields: Partial<Pick<Article, 'headline'|'standfirst'|'body'|'category'|'author'|'imageUrl'|'imageAlt'|'seoTitle'|'seoDescription'|'status'|'breaking'|'featured'>>) {
  if (demo) return null;
  const patch: Record<string, unknown> = { modified_at: new Date().toISOString() };
  if (fields.headline !== undefined) patch.headline = fields.headline;
  if (fields.standfirst !== undefined) patch.standfirst = fields.standfirst;
  if (fields.body !== undefined) patch.body = fields.body;
  if (fields.category !== undefined) patch.category = fields.category;
  if (fields.author !== undefined) patch.author = fields.author;
  if (fields.imageUrl !== undefined) patch.image_url = fields.imageUrl;
  if (fields.imageAlt !== undefined) patch.image_alt = fields.imageAlt;
  if (fields.seoTitle !== undefined) patch.seo_title = fields.seoTitle;
  if (fields.seoDescription !== undefined) patch.seo_description = fields.seoDescription;
  if (fields.status !== undefined) patch.status = fields.status;
  if (fields.breaking !== undefined) patch.breaking = fields.breaking;
  if (fields.featured !== undefined) patch.featured = fields.featured;
  return supabase(`articles?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
}

export async function getArticleByFingerprint(fp: string): Promise<Article | null> {
  if (demo) return null;
  const rows = await supabase(`articles?select=*&source_fingerprint=eq.${fp}&limit=1`);
  return rows?.[0] ? fromRow(rows[0]) : null;
}

export async function insertArticle(article: Article) {
  if (demo) return article;
  const rows = await supabase('articles', { method: 'POST', body: JSON.stringify(toRow(article)) });
  return rows?.[0] ? fromRow(rows[0]) : article;
}

export async function updateArticleStatus(id: string, status: Article['status']) {
  if (demo) return null;
  return supabase(`articles?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ status, modified_at: new Date().toISOString() }) });
}

function toRow(a: Article) {
  return { id:a.id, slug:a.slug, headline:a.headline, standfirst:a.standfirst, body:a.body, category:a.category, tags:a.tags, author:a.author, published_at:a.publishedAt, modified_at:a.modifiedAt, image_url:a.imageUrl, image_alt:a.imageAlt, image_credit:a.imageCredit || null, featured:!!a.featured, breaking:!!a.breaking, status:a.status, seo_title:a.seoTitle, seo_description:a.seoDescription, source_fingerprint:a.sourceFingerprint || null, story_cluster:a.storyCluster || null, provenance:a.provenance || {} };
}
function fromRow(r: any): Article {
  return { id:r.id, slug:r.slug, headline:r.headline, standfirst:r.standfirst, body:r.body, category:r.category, tags:r.tags || [], author:r.author, publishedAt:r.published_at, modifiedAt:r.modified_at, imageUrl:r.image_url, imageAlt:r.image_alt, imageCredit:r.image_credit || undefined, featured:r.featured, breaking:r.breaking, status:r.status, seoTitle:r.seo_title, seoDescription:r.seo_description, sourceFingerprint:r.source_fingerprint || undefined, storyCluster:r.story_cluster || undefined, provenance:r.provenance || {} };
}
