import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { SITE_NAME } from "@/lib/constants"

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year } = context.params
    const sql = `
      SELECT DISTINCT Circuits.*
      FROM Circuits
      JOIN Races ON Circuits.Circuit_ID = Races.Circuit
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      WHERE Championships.Year = ? LIMIT ?;
    `

    const data = await executeQuery(sql, [year, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No circuits found for this year. Try with other one."
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
      api: SITE_NAME,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      circuits: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
