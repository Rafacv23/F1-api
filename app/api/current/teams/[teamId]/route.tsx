import { NextResponse } from "next/server"
import { CURRENT_YEAR, SITE_NAME } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { InferModel, eq } from "drizzle-orm"
import { results, teams } from "@/db/migrations/schema"
import { db } from "@/db"

export const revalidate = 120

interface ApiResponse extends BaseApiResponse {
  season: number | string
  team: InferModel<typeof teams>[]
}

export async function GET(request: Request, context: any) {
  try {
    const year = CURRENT_YEAR
    const { teamId } = context.params
    const teamData = await db
      .select({
        Teams: teams,
      })
      .from(teams)
      .innerJoin(results, eq(teams.teamId, results.teamId))
      .where(eq(teams.teamId, teamId))
      .limit(1)

    if (teamData.length === 0) {
      return apiNotFound(
        request,
        "No teams found for this year, try with other one."
      )
    }

    // Procesamos los datos
    const processedData = teamData.map((row) => {
      return {
        teamId: row.Teams.teamId,
        teamName: row.Teams.teamName,
        teamNationality: row.Teams.teamNationality,
        firstAppeareance: row.Teams.firstAppeareance,
        constructorsChampionships: row.Teams.constructorsChampionships,
        driversChampionships: row.Teams.driversChampionships,
        url: row.Teams.url,
      }
    })

    const response: ApiResponse = {
      api: SITE_NAME,
      url: request.url,
      total: processedData.length,
      season: year,
      team: processedData,
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=60",
      },
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
