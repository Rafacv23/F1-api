import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export const revalidate = 60

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    // const limit = 30
    const sql = `SELECT * FROM Circuits LIMIT ?`
    const data = await executeQuery(sql, [limit])

    if (data.length === 0) {
      return apiNotFound(request, "No circuits found.")
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
