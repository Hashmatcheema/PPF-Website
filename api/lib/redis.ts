import { Redis } from "@upstash/redis"

let client: Redis | null = null

export function getRedis(): Redis {
  if (!client) {
    client = Redis.fromEnv()
  }
  return client
}

export const CTAS_KEY = "ppf:ctas"
export const CONTACT_LIST_KEY = "ppf:contact_submissions"
