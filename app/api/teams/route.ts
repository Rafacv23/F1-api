import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { teams } from "@/db/migrations/schema"
import { InferModel } from "drizzle-orm"

export const revalidate = 300

type Team = InferModel<typeof teams>
interface ApiResponse extends BaseApiResponse {
  teams: Team[]
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const teamsData = await db
      .select()
      .from(teams)
      .limit(limit)
      .offset(offset)
      .orderBy(teams.teamId)

    // Verificar si se encontraron datos
    if (teamsData.length === 0) {
      return apiNotFound(request, "No teams found.")
    }

    teamsData.forEach((team) => {
      return {
        teamId: team.teamId,
        teamName: team.teamName,
        country: team.teamNationality,
        firstAppareance: team.firstAppeareance,
        driversChampionships: team.driversChampionships,
        constructorsChampionships: team.constructorsChampionships,
        url: team.url,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      offset: offset,
      total: teamsData.length,
      teams: teamsData,
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
