import { NextResponse } from "next/server"
import { SITE_NAME } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse, ProcessedTeams, Team, Teams } from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: number | string
  team: ProcessedTeams
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 1
  try {
    const { year, teamId } = context.params
    const sql = `
      SELECT DISTINCT Teams.*
      FROM Teams
      JOIN Results ON Teams.Team_ID = Results.Team_ID
      JOIN Races ON Results.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      WHERE Championships.Year = ? AND Teams.Team_ID = ? LIMIT ?;
    `

    const data: Teams = await executeQuery(sql, [year, teamId, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No teams found for this year, try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row: Team) => {
      return {
        teamId: row.Team_ID,
        teamName: row.Team_Name,
        country: row.Team_Nationality,
        firstAppareance: row.First_Appareance,
        constructorsChampionships: row.Constructors_Championships,
        driversChampionships: row.Drivers_Championships,
        url: row.URL,
      }
    })

    const response: ApiResponse = {
      api: SITE_NAME,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      team: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
