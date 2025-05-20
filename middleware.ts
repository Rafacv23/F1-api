import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18nRouter } from "next-i18n-router"
import i18nConfig from "./i18nConfig"
import { LRUCache } from "lru-cache"

// 🧠 In-memory rate limiter (temporary fallback)
const memoryCache = new LRUCache<string, number>({
  max: 1000,
  ttl: 1000 * 60 * 10, // 10 minutes
})

const RATE_LIMIT = 100 // max requests
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api")) {
    const ip =
      request.headers.get("x-forwarded-for") || request.ip || "anonymous"

    const count = memoryCache.get(ip) || 0

    if (count >= RATE_LIMIT) {
      return new NextResponse("Rate limit exceeded (memory)", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": (Date.now() + WINDOW_MS).toString(),
        },
      })
    }

    memoryCache.set(ip, count + 1)

    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", RATE_LIMIT.toString())
    response.headers.set(
      "X-RateLimit-Remaining",
      (RATE_LIMIT - count - 1).toString()
    )
    response.headers.set(
      "X-RateLimit-Reset",
      (Date.now() + WINDOW_MS).toString()
    )
    return response
  }

  return i18nRouter(request, i18nConfig)
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)", "/api/:path*"],
}
