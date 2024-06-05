import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse, ProcessedTeam, Team, Teams } from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  team: ProcessedTeam[]
}

export async function GET(request: Request, context: any) {
  try {
    const { teamId } = context.params // Captura el parámetro teamId de la URL
    const limit = 1
    const sql = "SELECT * FROM Teams WHERE Team_Id = ? LIMIT ?"

    const data: Teams = await executeQuery(sql, [teamId, limit])

    if (data.length === 0) {
      return apiNotFound(request, "No teams found for this id, try with other.")
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
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      team: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
