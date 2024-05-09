import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { SITE_NAME } from "@/lib/constants"

export async function GET(request: Request, context: any) {
  try {
    const { year } = context.params
    const queryParams = new URL(request.url).searchParams
    const limit = queryParams.get("limit") || 30
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
        Circuit_ID: row[0],
        Circuit_Name: row[1],
        Country: row[2],
        City: row[3],
        Circuit_Length: row[4],
        Lap_Record: row[5],
        First_Participation_Year: row[6],
        Number_of_Corners: row[7],
        Fastest_Lap_Driver_ID: row[8],
        Fastest_Lap_Team_ID: row[9],
        Fastest_Lap_Year: row[10],
        Url: row[11],
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
