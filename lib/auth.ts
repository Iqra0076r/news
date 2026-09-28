import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'atlas_admin';
function secret() { return process.env.SESSION_SECRET || 'development-only-secret-change-me'; }
function sign(value: string) { return createHmac('sha256', secret()).update(value).digest('hex'); }

export function makeSession(email: string) {
  const exp = Date.now() + 12 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token?: string) {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try { const data = JSON.parse(Buffer.from(payload, 'base64url').toString()); return data.exp > Date.now(); } catch { return false; }
}

export async function isAdmin() { return verifySession((await cookies()).get(COOKIE)?.value); }
export const adminCookieName = COOKIE;
