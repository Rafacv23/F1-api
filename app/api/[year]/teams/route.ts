import { NextResponse } from "next/server"
import { SITE_NAME } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year } = context.params
    const sql = `
      SELECT DISTINCT Teams.*
      FROM Teams
      JOIN Results ON Teams.Team_ID = Results.Team_ID
      JOIN Races ON Results.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      WHERE Championships.Year = ? LIMIT ?;
    `

    const data = await executeQuery(sql, [year, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No teams found for this year, try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
      return {
        Team_ID: row[0],
        Team_Name: row[1],
        Team_Nationality: row[2],
        First_Appareance: row[3],
        Constructors_Championships: row[4],
        Drivers_Championships: row[5],
        URL: row[6],
      }
    })

    return NextResponse.json({
      api: SITE_NAME,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      teams: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
