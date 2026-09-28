import { createHash } from 'node:crypto';

export function slugify(input: string) {
  return input.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 90);
}

export function stripHtml(input: string) {
  return input.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}

export function normalizeUrl(raw: string) {
  try {
    const url = new URL(raw);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','mc_cid','mc_eid'].forEach(k => url.searchParams.delete(k));
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch { return raw.trim(); }
}

export function fingerprint(...parts: string[]) {
  return createHash('sha256').update(parts.map(p => p.toLowerCase().replace(/\s+/g, ' ').trim()).join('|')).digest('hex');
}

export function tokenSimilarity(a: string, b: string) {
  const ta = new Set(a.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3));
  const tb = new Set(b.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  ta.forEach(t => { if (tb.has(t)) inter++; });
  return inter / (ta.size + tb.size - inter);
}

export function formatTime(iso: string) {
  const date = new Date(iso);
  const mins = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60_000));
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}
