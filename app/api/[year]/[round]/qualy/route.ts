import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year, round } = context.params
    const sql = `
      SELECT Classifications.*, Races.*, Drivers.*, Teams.*, Circuits.*
      FROM Classifications
      JOIN Races ON Classifications.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      JOIN Drivers ON Classifications.Driver_ID = Drivers.Driver_ID
      JOIN Teams ON Classifications.Team_ID = Teams.Team_ID
      JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
      WHERE Championships.Year = ? AND Races.Round = ?
      ORDER BY Classifications.Grid_Position ASC
      LIMIT ?;
    `

    const data = await executeQuery(sql, [year, round, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No qualy results found for this round. Try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row) => ({
      Qualification_ID: row[0],
      Race_ID: row[1],
      Driver_ID: row[2],
      Team_ID: row[3],
      Q1_Time: row[4],
      Q2_Time: row[5],
      Q3_Time: row[6],
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
        round: round,
        Races: [
          {
            season: year,
            round: round,
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
