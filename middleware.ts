import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18nRouter } from "next-i18n-router"
import i18nConfig from "./i18nConfig"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
const ratelimit =
  upstashUrl && upstashToken
    ? new Ratelimit({
        redis: new Redis({
          url: upstashUrl,
          token: upstashToken,
        }),
        limiter: Ratelimit.fixedWindow(100, "10 m"),
        analytics: true,
      })
    : null

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api")) {
    const forwardedFor = request.headers.get("x-forwarded-for")
    const clientIp = forwardedFor?.split(",")[0]?.trim()
    const ip = clientIp || request.ip || "anonymous"

    if (ratelimit) {
      try {
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
      } catch (error) {
        console.error("Rate limiter failed in middleware:", error)
      }
    }

    return NextResponse.next()
  }

  return i18nRouter(request, i18nConfig)
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)", "/api/:path*"],
}
