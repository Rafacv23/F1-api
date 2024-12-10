import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { teams } from "@/db/migrations/schema"
import { eq, InferModel } from "drizzle-orm"

export const revalidate = 60

type Team = InferModel<typeof teams>

interface ApiResponse extends BaseApiResponse {
  team: Team[]
}

export async function GET(request: Request, context: any) {
  try {
    const { teamId } = context.params
    const limit = 1
    const teamData = await db
      .select()
      .from(teams)
      .where(eq(teams.teamId, teamId))
      .limit(limit)

    if (teamData.length === 0) {
      return apiNotFound(request, "No team found for this id, try with other.")
    }

    teamData.forEach((team) => {
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
      total: teamData.length,
      team: teamData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
