import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18nRouter } from "next-i18n-router"
import i18nConfig from "./i18nConfig"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(100, "10 m"),
  analytics: true,
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🧭 Rate limit only /api routes
  if (pathname.startsWith("/api")) {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.ip ||
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

    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", limit.toString())
    response.headers.set("X-RateLimit-Remaining", remaining.toString())
    response.headers.set("X-RateLimit-Reset", reset.toString())
    return response
  }

  // 🌐 Apply i18n to all other routes (non-API)
  return i18nRouter(request, i18nConfig)
}

export const config = {
  matcher: [
    // Apply i18nRouter to non-API pages
    "/((?!api|static|.*\\..*|_next).*)",
    // Apply rate limiter only to API routes
    "/api/:path*",
  ],
}
