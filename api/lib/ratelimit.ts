import { Ratelimit } from "@upstash/ratelimit"
import { getRedis } from "./redis.js"

let loginRl: Ratelimit | null = null
let ctasRl: Ratelimit | null = null
let contactRl: Ratelimit | null = null

export function ratelimitLogin(): Ratelimit {
  if (!loginRl) {
    loginRl = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(8, "1 m"),
      prefix: "ppf:rl:login",
    })
  }
  return loginRl
}

export function ratelimitCtasPut(): Ratelimit {
  if (!ctasRl) {
    ctasRl = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(40, "1 m"),
      prefix: "ppf:rl:ctas",
    })
  }
  return ctasRl
}

export function ratelimitContact(): Ratelimit {
  if (!contactRl) {
    contactRl = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(12, "1 h"),
      prefix: "ppf:rl:contact",
    })
  }
  return contactRl
}
