import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"
import { BaseApiResponse, Circuit, ProcessedCircuits } from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  circuit: ProcessedCircuits
}

export async function GET(request: Request, context: any) {
  try {
    const { circuitId } = context.params // Captura el parámetro driverId de la URL
    const sql = "SELECT * FROM Circuits WHERE Circuit_ID = ? LIMIT ?"
    const limit = 1

    const data = await executeQuery(sql, [circuitId, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No driver found for this id, try with other one."
      )
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
      circuit: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
