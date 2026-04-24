import { Ratelimit } from "@upstash/ratelimit"
import { getRedis } from "./redis.js"

let loginRl: Ratelimit | null = null
let ctasRl: Ratelimit | null = null
let contactRl: Ratelimit | null = null

export function ratelimitLogin(): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null
  if (!loginRl) {
    loginRl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, "1 m"),
      prefix: "ppf:rl:login",
    })
  }
  return loginRl
}

export function ratelimitCtasPut(): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null
  if (!ctasRl) {
    ctasRl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(40, "1 m"),
      prefix: "ppf:rl:ctas",
    })
  }
  return ctasRl
}

export function ratelimitContact(): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null
  if (!contactRl) {
    contactRl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(12, "1 h"),
      prefix: "ppf:rl:contact",
    })
  }
  return contactRl
}
