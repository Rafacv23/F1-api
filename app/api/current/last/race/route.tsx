import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { getYear, getDay } from "@/lib/utils"
import { BaseApiResponse, Circuit } from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: number | string
  races: any
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 20
  try {
    const year = getYear()
    const today = getDay()

    const sql = `
      SELECT Results.*, Races.*, Drivers.*, Teams.*, Circuits.*
      FROM Results
      JOIN Races ON Results.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      JOIN Drivers ON Results.Driver_ID = Drivers.Driver_ID
      JOIN Teams ON Results.Team_ID = Teams.Team_ID
      JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
      WHERE Championships.Year = ? AND Races.Race_Date <= ?
      ORDER BY Races.Race_Date DESC, Results.Finishing_Position ASC
      LIMIT ?;
    `

    const data = await executeQuery(sql, [year, today, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No race results found for this round. Try with other one."
      )
    }

    // Procesamos los datos de los resultados
    const processedData = data.map((row: any) => ({
      position: row[4],
      points: row[8],
      driver: {
        driverId: row[35],
        number: row[40],
        shortName: row[41],
        url: row[42],
        name: row[36],
        surname: row[37],
        nationality: row[38],
        birthday: row[39],
      },
      team: {
        teamId: row[3],
        teamName: row[44],
        nationality: row[45],
        firstAppareance: row[46],
        constructorsChampionships: row[47],
        driversChampionships: row[48],
        url: row[49],
      },
      grid: row[5],
      time: row[6],
      retired: row[7],
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
        date: data[0][12],
        time: data[0][19],
        url: data[0][17],
        raceId: data[0][1],
        raceName: data[0][11],
        circuit: circuitData[0],
        results: processedData,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
