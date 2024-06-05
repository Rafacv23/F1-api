import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse, ProcessedTeam, Team, Teams } from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  teams: ProcessedTeam[]
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const sql = "SELECT * FROM teams LIMIT ?;"
    const data: Teams = await executeQuery(sql, [limit])

    // Verificar si se encontraron datos
    if (data.length === 0) {
      return apiNotFound(request, "No teams found.")
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
      teams: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error:", error) // Agregamos un mensaje de error para la consola
    return NextResponse.error()
  }
}
