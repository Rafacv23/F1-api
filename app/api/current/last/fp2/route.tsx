import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound, getDay, getYear } from "@/lib/utils"

//revalidate

export const revalidate = 60

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const year = getYear()
    const today = getDay()

    const sql = `
      SELECT FP2.*, Races.*, Drivers.*, Teams.*, Circuits.*
      FROM FP2
      JOIN Races ON FP2.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      JOIN Drivers ON FP2.Driver_ID = Drivers.Driver_ID
      JOIN Teams ON FP2.Team_ID = Teams.Team_ID
      JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
      WHERE Championships.Year = ? AND Races.Race_Date <= ?
      ORDER BY Races.Race_Date DESC, FP2.Time ASC
      LIMIT ?;
    `

    const data = await executeQuery(sql, [year, today, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No qualy results found for this round. Try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row) => ({
      fp1Id: row[0],
      raceId: row[1],
      driverId: row[2],
      teamId: row[3],
      time: row[4],
      driver: {
        driverId: row[2],
        name: row[29],
        surname: row[30],
        country: row[31],
        birthday: row[32],
        number: row[33],
        shortName: row[34],
        url: row[35],
      },
      team: {
        teamId: row[36],
        teamName: row[37],
        nationality: row[38],
        firstAppareance: row[39],
        constructorsChampionships: row[40],
        driversChampionships: row[41],
        url: row[42],
      },
    }))

    // Obtener el circuito correspondiente a la carrera
    const circuitData = {
      circuitId: data[0][43],
      circuitName: data[0][44],
      country: data[0][45],
      city: data[0][46],
      circuitLength: data[0][47] + "km",
      lapRecord: data[0][48],
      firstParticipationYear: data[0][49],
      corners: data[0][50],
      fastestLapDriverId: data[0][51],
      fastestLapTeamId: data[0][52],
      fastestLapYear: data[0][53],
      url: data[0][54],
    }

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: data.length,
      RaceTable: {
        season: year,
        date: data[0][17],
        time: data[0][23],
        Races: [
          {
            url: data[0][13],
            raceName: data[0][7],
            Circuit: circuitData,
            FP1_Results: processedData,
          },
        ],
      },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
