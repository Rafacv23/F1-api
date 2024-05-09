import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { SITE_URL } from "@/lib/constants"
export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year } = context.params
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
        Driver_ID: row[0],
        Name: row[1],
        Surname: row[2],
        Nationality: row[3],
        Birthday: row[4],
        Number: row[5],
        Short_Name: row[6],
        URL: row[7],
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
