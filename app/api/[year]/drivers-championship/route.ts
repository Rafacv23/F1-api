import { NextResponse } from "next/server"
import { SITE_NAME } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year } = context.params
    const sql = `SELECT Driver_Classifications.*, Drivers.*, Teams.*
    FROM Driver_Classifications
    JOIN Championships ON Driver_Classifications.Championship_ID = Championships.Championship_ID
    JOIN Drivers ON Driver_Classifications.Driver_ID = Drivers.Driver_ID
    JOIN Teams ON Driver_Classifications.Team_ID = Teams.Team_ID
    WHERE Championships.Year = ?
    ORDER BY Driver_Classifications.Points DESC, Driver_Classifications.Position ASC
    LIMIT ?;
    `

    const data = await executeQuery(sql, [year, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No drivers championship found for this year, try with other one."
      )
    }
    // Procesamos los datos
    const processedData = data.map((row) => {
      return {
        classificationId: row[0],
        championshipId: row[1],
        driverId: row[2],
        teamId: row[3],
        points: row[4],
        position: row[5],
        driver: {
          // Aquí obtienes la información del piloto
          driverId: row[3],
          name: row[7],
          surname: row[8],
          nationality: row[9],
          birthday: row[10],
          number: row[11],
          short_name: row[12],
          url: row[13],
        },
        Team: {
          // Aquí obtienes la información del equipo
          teamId: row[14],
          name: row[15],
          nationality: row[16],
          firstAppareance: row[17],
          constructorsChampionships: row[18],
          driversChampionships: row[19],
          url: row[20],
        },
      }
    })

    return NextResponse.json({
      api: SITE_NAME,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      drivers_championship: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
