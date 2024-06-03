import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

//revalidate

export const revalidate = 60

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
        name: row[32],
        surname: row[33],
        country: row[34],
        birthday: row[35],
        number: row[36],
        shortName: row[37],
        url: row[38],
      },
      team: {
        teamId: row[39],
        teamName: row[40],
        nationality: row[41],
        firstAppareance: row[42],
        constructorsChampionships: row[43],
        driversChampionships: row[44],
        url: row[45],
      },
    }))

    // Obtener el circuito correspondiente a la carrera
    const circuitData = {
      circuitId: data[0][46],
      circuitName: data[0][47],
      country: data[0][48],
      city: data[0][49],
      circuitLength: data[0][50] + "km",
      lapRecord: data[0][51],
      firstParticipationYear: data[0][52],
      corners: data[0][53],
      fastestLapDriverId: data[0][54],
      fastestLapTeamId: data[0][55],
      fastestLapYear: data[0][56],
      url: data[0][57],
    }

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: data.length,
      RaceTable: {
        season: year,
        round: round,
        date: data[0][19],
        time: data[0][25],
        Races: [
          {
            url: data[0][16],
            raceName: data[0][10],
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
