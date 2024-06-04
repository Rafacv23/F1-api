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
        wins: row[6],
        driver: {
          // Aquí obtienes la información del piloto
          driverId: row[7],
          name: row[8],
          surname: row[9],
          nationality: row[10],
          birthday: row[11],
          number: row[12],
          short_name: row[13],
          url: row[14],
        },
        team: {
          // Aquí obtienes la información del equipo
          teamId: row[15],
          name: row[16],
          nationality: row[17],
          firstAppareance: row[18],
          constructorsChampionships: row[19],
          driversChampionships: row[20],
          url: row[21],
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
