import { NextResponse } from "next/server"
import { SITE_NAME } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { constructorsClassifications, teams } from "@/db/migrations/schema"
import { asc, eq, InferModel } from "drizzle-orm"

export const revalidate = 600

interface ApiResponse extends BaseApiResponse {
  teams: InferModel<typeof teams>[]
  season: string | number
  championshipId: string
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const { year } = context.params

    const teamsData = await db
      .select({
        teamId: teams.teamId,
        teamName: teams.teamName,
        teamNationality: teams.teamNationality,
        firstAppeareance: teams.firstAppeareance,
        constructorsChampionships: teams.constructorsChampionships,
        driversChampionships: teams.driversChampionships,
        url: teams.url,
      })
      .from(teams)
      .innerJoin(
        constructorsClassifications,
        eq(teams.teamId, constructorsClassifications.teamId)
      )
      .where(eq(constructorsClassifications.championshipId, `f1_${year}`))
      .orderBy(asc(constructorsClassifications.position))
      .limit(limit)
      .offset(offset)

    if (teamsData.length === 0) {
      return apiNotFound(
        request,
        "No teams found for this year, try with other one."
      )
    }

    teamsData.forEach((team) => {
      return {
        teamId: team.teamId,
        teamName: team.teamName,
        country: team.teamNationality,
        firstAppeareance: team.firstAppeareance,
        constructorsChampionships: team.constructorsChampionships,
        driversChampionships: team.driversChampionships,
        url: team.url,
      }
    })

    const response: ApiResponse = {
      api: SITE_NAME,
      url: request.url,
      limit: limit,
      offset: offset,
      total: teamsData.length,
      season: year,
      championshipId: `f1_${year}`,
      teams: teamsData,
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
