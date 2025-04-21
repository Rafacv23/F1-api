import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { championships } from "@/db/migrations/schema"
import { InferModel, desc } from "drizzle-orm"

export const revalidate = 300

type Championship = InferModel<typeof championships>

interface ApiResponse extends BaseApiResponse {
  championships: Championship[]
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const seasonsData = await db
      .select()
      .from(championships)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(championships.championshipId))

    if (seasonsData.length === 0) {
      return apiNotFound(request, "No seasons found.")
    }

    seasonsData.forEach((season) => {
      return {
        championshipId: season.championshipId,
        championshipName: season.championshipName,
        url: season.url,
        year: season.year,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      offset: offset,
      total: seasonsData.length,
      championships: seasonsData,
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=60",
      },
      status: 200,
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
