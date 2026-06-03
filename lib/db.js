// Upstash Redis client (REST API — works in Node serverless routes).
// Provisioned via Vercel Marketplace → Upstash for Redis; Vercel injects
// KV_REST_API_URL and KV_REST_API_TOKEN into the project env.
import { Redis } from '@upstash/redis';

let _redis;

export function getRedis() {
  if (!_redis) {
    // Vercel/Upstash injects KV_REST_API_* ; some setups use UPSTASH_REDIS_REST_* — accept both.
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error(
        'Upstash Redis env vars missing (KV_REST_API_URL / KV_REST_API_TOKEN). Connect the Upstash store to this project.'
      );
    }
    _redis = new Redis({ url, token });
  }
  return _redis;
}
