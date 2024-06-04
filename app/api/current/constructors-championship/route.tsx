import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getYear } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"

export const revalidate = 60

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const year = getYear()
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
        championshipId: row[1],
        teamId: row[2],
        points: row[3],
        position: row[4],
        wins: row[5],
        team: {
          // Aquí obtienes la información del equipo
          teamId: row[6],
          name: row[7],
          nationality: row[8],
          firstAppareance: row[9],
          constructorsChampionships: row[10],
          driversChampionships: row[11],
          url: row[12],
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
