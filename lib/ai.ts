import type { FeedItem } from './types';
import { slugify } from './utils';

export type GeneratedStory = {
  headline: string;
  standfirst: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  imageAlt: string;
  verification: { supported: boolean; notes: string[] };
};

async function callAI(prompt: string) {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  if (provider === 'ollama') {
    const base = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
    const res = await fetch(`${base}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OLLAMA_MODEL || 'qwen3:8b', prompt, stream: false, format: 'json' })
    });
    if (!res.ok) throw new Error(`Local AI generation failed: ${res.status}`);
    const json = await res.json();
    return json.response as string | undefined;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-5.6', input: prompt })
  });
  if (!res.ok) throw new Error(`AI generation failed: ${res.status}`);
  const json = await res.json();
  return json.output_text as string | undefined;
}


export async function generateStory(item: FeedItem): Promise<GeneratedStory | null> {
  const prompt = `You are the article generation stage of a professional newsroom pipeline.\n\nFACT PACK FROM AN APPROVED FEED:\nTitle: ${item.title}\nPublished: ${item.publishedAt}\nCategory: ${item.category}\nSummary/facts: ${item.description}\n\nWrite an ORIGINAL article using only supported facts above. Do not invent details, quotes, motives, dates, numbers, named people or organizations. Do not mention the upstream publication or say \"according to reports\". If the facts are too thin for a useful article, return {\"supported\":false}.\n\nReturn ONLY valid JSON with: supported:boolean, headline:string, standfirst:string, body:string (4-8 short paragraphs separated by \\n\\n), seoTitle:string (<=60 chars), seoDescription:string (<=155 chars), tags:string[] (3-6), imageAlt:string, notes:string[].`;
  const out = await callAI(prompt);
  if (!out) return null;
  try {
    const clean = out.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(clean);
    return {
      headline: parsed.headline || item.title,
      standfirst: parsed.standfirst || item.description.slice(0, 180),
      body: parsed.body || '',
      seoTitle: parsed.seoTitle || item.title.slice(0, 60),
      seoDescription: parsed.seoDescription || item.description.slice(0, 155),
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [item.category],
      imageAlt: parsed.imageAlt || `Editorial image related to ${item.title}`,
      verification: { supported: Boolean(parsed.supported), notes: Array.isArray(parsed.notes) ? parsed.notes : [] }
    };
  } catch { return null; }
}

export async function isSameEvent(candidateTitle: string, candidateSummary: string, existingHeadline: string, existingStandfirst: string) {
  const prompt = `Decide whether these two news records describe the SAME underlying event, not merely the same topic. Return ONLY JSON: {"sameEvent":true|false,"confidence":0-1}.\n\nCandidate headline: ${candidateTitle}\nCandidate summary: ${candidateSummary}\n\nExisting headline: ${existingHeadline}\nExisting summary: ${existingStandfirst}`;
  const out = await callAI(prompt);
  if (!out) return false;
  try {
    const parsed = JSON.parse(out.replace(/^```json\s*/i, '').replace(/```$/i, '').trim());
    return parsed.sameEvent === true && Number(parsed.confidence || 0) >= 0.82;
  } catch { return false; }
}

export function storySlug(story: GeneratedStory, id: string) {
  return `${slugify(story.headline)}-${id.slice(0, 6)}`;
}
