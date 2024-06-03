import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export const revalidate = 60

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
        number: row[37],
        shortName: row[38],
        url: row[39],
        name: row[33],
        surname: row[34],
        nationality: row[35],
        birthday: row[36],
      },
      team: {
        teamId: row[3],
        teamName: row[41],
        nationality: row[42],
        firstAppareance: row[43],
        constructorsChampionships: row[44],
        driversChampionships: row[45],
        url: row[46],
      },
      grid: row[5],
      time: row[6],
      retired: row[7],
    }))

    // Obtener los datos del circuito
    const circuitData = {
      circuitId: data[0][47],
      circuitName: data[0][48],
      country: data[0][49],
      city: data[0][50],
      circuitLength: data[0][51] + "km",
      lapRecord: data[0][52],
      firstParticipationYear: data[0][53],
      corners: data[0][54],
      fastestLapDriverId: data[0][55],
      fastestLapTeamId: data[0][56],
      fastestLapYear: data[0][57],
      url: data[0][58],
    }

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: data.length,
      RaceTable: {
        season: year,
        round: round,
        date: data[0][12],
        time: data[0][19],
        Races: [
          {
            url: data[0][17],
            raceName: data[0][11],
            Circuit: circuitData,
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
