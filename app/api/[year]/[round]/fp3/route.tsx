import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse, Circuit } from "@/lib/definitions"

//revalidate

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: number | string
  races: any
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year, round } = context.params
    const sql = `
      SELECT FP3.*, Races.*, Drivers.*, Teams.*, Circuits.*
      FROM FP3
      JOIN Races ON FP3.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      JOIN Drivers ON FP3.Driver_ID = Drivers.Driver_ID
      JOIN Teams ON FP3.Team_ID = Teams.Team_ID
      JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
      WHERE Championships.Year = ? AND Races.Round = ?
      ORDER BY FP3.Time ASC
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
    const processedData = data.map((row: any) => ({
      fp3Id: row[0],
      raceId: row[1],
      driverId: row[2],
      teamId: row[3],
      time: row[4],
      driver: {
        driverId: row[31],
        number: row[36],
        shortName: row[37],
        url: row[38],
        name: row[32],
        surname: row[33],
        nationality: row[34],
        birthday: row[35],
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
    const circuitData = data.map((row: Circuit) => {
      return {
        circuitId: row.Circuit_ID,
        circuitName: row.Circuit_Name,
        country: row.Country,
        city: row.City,
        circuitLength: row.Circuit_Length + "km",
        lapRecord: row.Lap_Record,
        firstParticipationYear: row.First_Participation_Year,
        corners: row.Number_of_Corners,
        fastestLapDriverId: row.Fastest_Lap_Driver_ID,
        fastestLapTeamId: row.Fastest_Lap_Team_ID,
        fastestLapYear: row.Fastest_Lap_Year,
        url: row.Url,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: data.length,
      season: year,
      races: {
        round: round,
        date: data[0][17],
        time: data[0][23],
        url: data[0][13],
        raceId: data[0][1],
        raceName: data[0][7],
        circuit: circuitData[0],
        FP3_Results: processedData,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
