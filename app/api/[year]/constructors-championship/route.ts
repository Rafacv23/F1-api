import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year } = context.params
    const sql = `SELECT Constructors_Classifications.*, Teams.*
    FROM Constructors_Classifications
    JOIN Championships ON Constructors_Classifications.Championship_ID = Championships.Championship_ID
    JOIN Teams ON Constructors_Classifications.Team_ID = Teams.Team_ID
    WHERE Championships.Year = ?
    ORDER BY Constructors_Classifications.Points DESC, Constructors_Classifications.Position ASC
    LIMIT ?;
    `

    const data = await executeQuery(sql, [year, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No constructors championship found for this year. Try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
      return {
        classificationId: row[0],
        ChampionchampionshipId: row[1],
        teamId: row[2],
        points: row[3],
        position: row[4],
        team: {
          // Aquí obtienes la información del equipo
          teamId: row[5],
          name: row[6],
          nationality: row[7],
          firstAppareance: row[8],
          constructorsChampionships: row[9],
          driversChampionships: row[10],
          url: row[11],
        },
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      constructors_championship: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
