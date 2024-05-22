import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"

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
    const processedData = data.map((row) => {
      return {
        circuitId: row[0],
        circuitName: row[1],
        country: row[2],
        city: row[3],
        circuitLength: row[4],
        lapRecord: row[5],
        firstParticipationYear: row[6],
        corners: row[7],
        fastestLapDriverId: row[8],
        fastestLapTeamId: row[9],
        fastestLapYear: row[10],
        url: row[11],
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      circuits: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
