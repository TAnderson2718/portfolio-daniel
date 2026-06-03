// Append-only audit log in Redis (capped to the most recent MAX entries).
// Each entry: { ts, actor, action, detail }
import { getRedis } from './db';

const AUDIT_KEY = 'audit';
const MAX = 500;

export async function logAction(actor, action, detail = '') {
  try {
    const redis = getRedis();
    await redis.lpush(AUDIT_KEY, {
      ts: new Date().toISOString(),
      actor: actor || 'unknown',
      action,
      detail: String(detail || ''),
    });
    await redis.ltrim(AUDIT_KEY, 0, MAX - 1);
  } catch (e) {
    // never let logging break the actual operation
    console.error('audit log failed:', e?.message);
  }
}

export async function listAudit(limit = 100) {
  const n = Math.min(Math.max(1, limit), MAX);
  const rows = await getRedis().lrange(AUDIT_KEY, 0, n - 1);
  // @upstash/redis auto-deserializes objects; guard in case of legacy strings
  return rows
    .map((r) => (typeof r === 'string' ? safeParse(r) : r))
    .filter(Boolean);
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
