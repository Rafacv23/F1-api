import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { constructorsClassifications, teams } from "@/db/migrations/schema"
import { asc, eq } from "drizzle-orm"

export const revalidate = 600

interface ApiResponse extends BaseApiResponse {
  season: string | number
  championshipId: string
  constructors_championship: any
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const { year } = context.params

    const teamStandingsData = await db
      .select()
      .from(constructorsClassifications)
      .innerJoin(teams, eq(teams.teamId, constructorsClassifications.teamId))
      .where(eq(constructorsClassifications.championshipId, `f1_${year}`))
      .orderBy(asc(constructorsClassifications.position))
      .limit(limit)
      .offset(offset)

    if (teamStandingsData.length === 0) {
      return apiNotFound(
        request,
        "No constructors championship found for this year. Try with other one."
      )
    }

    const processedData = teamStandingsData.map((team) => {
      return {
        classificationId: team.Constructors_Classifications.classificationId,
        teamId: team.Constructors_Classifications.teamId,
        points: team.Constructors_Classifications.points,
        position: team.Constructors_Classifications.position,
        wins: team.Constructors_Classifications.wins,
        team: {
          teamName: team.Teams.teamName,
          country: team.Teams.teamNationality,
          firstAppareance: team.Teams.firstAppeareance,
          constructorsChampionships: team.Teams.constructorsChampionships,
          driversChampionships: team.Teams.driversChampionships,
          url: team.Teams.url,
        },
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      offset: offset,
      total: teamStandingsData.length,
      season: parseInt(year),
      championshipId: `f1_${year}`,
      constructors_championship: processedData,
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
