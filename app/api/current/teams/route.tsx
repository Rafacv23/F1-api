import { NextResponse } from "next/server"
import { SITE_NAME } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound, getYear } from "@/lib/utils"

export const revalidate = 60

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const year = getYear()
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
        teamId: row[0],
        teamName: row[1],
        country: row[2],
        firstAppareance: row[3],
        constructorsChampionships: row[4],
        driversChampionships: row[5],
        url: row[6],
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
