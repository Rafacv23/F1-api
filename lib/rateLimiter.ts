// lib/rateLimit.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(100, "10 m"), // 100 requests per 10 minutes
  analytics: true,
})

import { NextResponse } from "next/server"
export async function withRateLimit(
  request: Request,
  handler: () => Promise<Response>
) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "anonymous"

  const { success, limit, remaining, reset } = await ratelimit.limit(ip)

  if (!success) {
    return new NextResponse("Rate limit exceeded", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    })
  }

  return handler()
}
