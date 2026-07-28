import { Redis } from '@upstash/redis';

let client = null;

export function getRedis() {
  if (!client) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    client = new Redis({ url, token });
  }
  return client;
}
