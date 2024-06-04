import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound, getYear } from "@/lib/utils"
import { SITE_URL } from "@/lib/constants"

export const revalidate = 60
export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const year = getYear()
    const sql = `
      SELECT DISTINCT Drivers.*
      FROM Drivers
      JOIN Results ON Drivers.Driver_ID = Results.Driver_ID
      JOIN Races ON Results.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      WHERE Championships.Year = ? LIMIT ?;
    `

    const data = await executeQuery(sql, [year, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No drivers found fot this year, try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
      return {
        driverId: row[0],
        name: row[1],
        surname: row[2],
        country: row[3],
        birthday: row[4],
        number: row[5],
        shortName: row[6],
        url: row[7],
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      drivers: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
