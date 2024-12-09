import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse, Circuit } from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: number | string
  races: any
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 20
  try {
    const { year, round } = context.params

    const sql = `
    SELECT Sprint_Race.*, Races.*, Drivers.*, Teams.*, Circuits.*
    FROM Sprint_Race
    JOIN Races ON Sprint_Race.Race_ID = Races.Race_ID
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    JOIN Drivers ON Sprint_Race.Driver_ID = Drivers.Driver_ID
    JOIN Teams ON Sprint_Race.Team_ID = Teams.Team_ID
    JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
    WHERE Championships.Year = ? AND Races.Round = ?
    ORDER BY Sprint_Race.Finishing_Position ASC
    LIMIT ?;
    `

    const data = await executeQuery(sql, [year, round, limit])

    console.log(data)

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No sprint race results found for this round. Try with other one."
      )
    }

    // Procesamos los datos de los resultados
    const processedData = data.map((row: any) => ({
      sprintRaceId: row[0],
      position: row[4],
      points: row[9],
      driver: {
        driverId: row[2],
        number: row[41],
        shortName: row[42],
        url: row[43],
        name: row[37],
        surname: row[38],
        nationality: row[39],
        birthday: row[40],
      },
      team: {
        teamId: row[44],
        teamName: row[45],
        nationality: row[46],
        firstAppareance: row[47],
        constructorsChampionships: row[48],
        driversChampionships: row[49],
        url: row[50],
      },
      grid: row[5],
      laps: row[6],
      time: row[7],
      retired: row[8],
    }))

    processedData.sort((a: any, b: any) => a.position - b.position)

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
        date: data[0][13],
        time: data[0][32],
        url: data[0][18],
        raceId: data[0][1],
        raceName: data[0][12],
        circuit: circuitData[0],
        sprintRaceResults: processedData,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
