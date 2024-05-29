import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound, getDay, getYear } from "@/lib/utils"

//revalidate

export const revalidate = 60

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 20
  try {
    const year = getYear()
    const today = getDay()
    const sql = `
      SELECT Sprint_Qualy.*, Races.*, Drivers.*, Teams.*, Circuits.*
      FROM Sprint_Qualy
      JOIN Races ON Sprint_Qualy.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      JOIN Drivers ON Sprint_Qualy.Driver_ID = Drivers.Driver_ID
      JOIN Teams ON Sprint_Qualy.Team_ID = Teams.Team_ID
      JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
      WHERE Championships.Year = ? AND Races.Round = ?
      ORDER BY Sprint_Qualy.Grid_Position ASC
      LIMIT ?;
    `

    const data = await executeQuery(sql, [year, today, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No sprint qualy results found for this round. Try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row) => ({
      Sprint_Qualification_ID: row[0],
      Race_ID: row[1],
      Driver_ID: row[2],
      Team_ID: row[3],
      SQ1_Time: row[4],
      SQ2_Time: row[5],
      SQ3_Time: row[6],
      Grid_Position: row[7],
      driver: {
        driverId: row[2],
        number: row[23],
        name: row[19],
        surname: row[20],
        shortName: row[24],
        url: row[25],
        nationality: row[21],
        birthday: row[22],
      },
      team: {
        teamId: row[26],
        teamName: row[27],
        nationality: row[28],
        firstAppareance: row[29],
        constructorsChampionships: row[30],
        driversChampionships: row[31],
        url: row[32],
      },
    }))

    // Obtener el circuito correspondiente a la carrera
    const circuitData = {
      circuitId: data[0][33],
      circuitName: data[0][34],
      country: data[0][35],
      city: data[0][36],
      circuitLength: data[0][37] + "km",
      lapRecord: data[0][38],
      firstParticipationYear: data[0][39],
      corners: data[0][40],
      fastestLapDriverId: data[0][41],
      fastestLapTeamId: data[0][42],
      fastestLapYear: data[0][43],
      url: data[0][44],
    }

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: data.length,
      RaceTable: {
        season: year,
        Races: [
          {
            season: year,
            url: data[0][16],
            raceName: data[0][10],
            Circuit: circuitData,
            date: data[0][11],
            Results: processedData,
          },
        ],
      },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
