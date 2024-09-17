import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"
import { BaseApiResponse, ConstructorsChampionship } from "@/lib/definitions"

export const revalidate = 10

interface ApiResponse extends BaseApiResponse {
  season: string | number
  constructors_championship: any
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year } = context.params
    const sql = `SELECT Constructors_Classifications.*, Teams.*
    FROM Constructors_Classifications
    JOIN Championships ON Constructors_Classifications.Championship_ID = Championships.Championship_ID
    JOIN Teams ON Constructors_Classifications.Team_ID = Teams.Team_ID
    WHERE Championships.Year = ?
    ORDER BY Constructors_Classifications.Points DESC, Constructors_Classifications.Position ASC
    LIMIT ?;
    `

    const data = await executeQuery(sql, [year, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No constructors championship found for this year. Try with other one."
      )
    }

    // Procesamos los datos
    const processedData: ConstructorsChampionship[] = data.map((row: any) => {
      return {
        classificationId: row.Classification_ID,
        championshipId: row.Championship_ID,
        teamId: row.Team_ID,
        points: row.Points,
        position: row.Position,
        wins: row.wins,
        team: {
          teamId: row.Team_ID,
          teamName: row.Team_Name,
          country: row.Team_Nationality,
          firstAppareance: row.First_Appareance,
          constructorsChampionships: row.Constructors_Championships,
          driversChampionships: row.Drivers_Championships,
          url: row.URL,
        },
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: data.length,
      season: year,
      constructors_championship: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
