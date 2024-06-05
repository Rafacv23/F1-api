import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import {
  BaseApiResponse,
  Circuit,
  Circuits,
  ProcessedCircuits,
} from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  circuits: ProcessedCircuits
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    // const limit = 30
    const sql = `SELECT * FROM Circuits LIMIT ?`
    const data: Circuits = await executeQuery(sql, [limit])

    if (data.length === 0) {
      return apiNotFound(request, "No circuits found.")
    }

    // Procesamos los datos
    const processedData = data.map((row: Circuit) => {
      return {
        circuitId: row.Circuit_ID,
        circuitName: row.Circuit_Name,
        country: row.Country,
        city: row.City,
        circuitLength: row.Circuit_Length,
        lapRecord: row.Lap_Record,
        firstParticipationYear: row.First_Participation_Year,
        corners: row.Number_of_Corners,
        fastestLapDriverId: row.Fastest_Lap_Driver_ID,
        fastestLapTeamId: row.Fastest_Lap_Team_ID,
        fastestLapYear: row.Fastest_Lap_Year,
        url: row.Url,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      circuits: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
