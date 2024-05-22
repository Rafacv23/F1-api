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
      SELECT Results.*, Races.*, Drivers.*, Teams.*, Circuits.*
      FROM Results
      JOIN Races ON Results.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      JOIN Drivers ON Results.Driver_ID = Drivers.Driver_ID
      JOIN Teams ON Results.Team_ID = Teams.Team_ID
      JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
      WHERE Championships.Year = ? AND Races.Round = ?
      ORDER BY Results.Finishing_Position ASC
      LIMIT ?;
    `

    const data = await executeQuery(sql, [year, round, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No race results found for this round. Try with other one."
      )
    }

    // Procesamos los datos de los resultados
    const processedData = data.map((row) => ({
      position: row[4],
      points: row[8],
      driver: {
        driverId: row[2],
        number: row[24],
        shortName: row[25],
        url: row[26],
        name: row[20],
        surname: row[21],
        nationality: row[22],
        birthday: row[23],
      },
      team: {
        teamId: row[3],
        teamName: row[28],
        nationality: row[29],
        firstAppareance: row[30],
        constructorsChampionships: row[31],
        driversChampionships: row[32],
        url: row[33],
      },
      grid: row[5],
      time: row[6],
      retired: row[7],
    }))

    // Obtener los datos del circuito
    const circuitData = {
      circuitId: data[0][34],
      circuitName: data[0][35],
      country: data[0][36],
      city: data[0][37],
      circuitLength: data[0][38] + "km",
      lapRecord: data[0][39],
      firstParticipationYear: data[0][40],
      corners: data[0][41],
      fastestLapDriverId: data[0][42],
      fastestLapTeamId: data[0][43],
      fastestLapYear: data[0][44],
      url: data[0][45],
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
            url: data[0][17],
            raceName: data[0][11],
            Circuit: circuitData,
            date: data[0][12],
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
