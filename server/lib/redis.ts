import { Redis } from "@upstash/redis"

let client: Redis | null = null

export function isRedisConfigured(): boolean {
  const url = String(process.env.UPSTASH_REDIS_REST_URL ?? "").trim()
  const token = String(process.env.UPSTASH_REDIS_REST_TOKEN ?? "").trim()
  return url.length > 0 && token.length > 0
}

/**
 * Upstash Redis client, or `null` when env vars are missing.
 * Local `vercel dev` without Upstash can still serve admin login + default CTAs.
 */
export function getRedis(): Redis | null {
  if (!isRedisConfigured()) return null
  if (!client) {
    client = Redis.fromEnv()
  }
  return client
}

export const CTAS_KEY = "ppf:ctas"
export const CONTACT_LIST_KEY = "ppf:contact_submissions"
