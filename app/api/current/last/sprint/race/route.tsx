import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound, getDay, getYear } from "@/lib/utils"
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
    //const today = 5 testing endpoint

    const sql = `
    SELECT Sprint_Race.*, Results.*, Drivers.*, Teams.*, Circuits.*
    FROM Sprint_Race
    JOIN Races ON Sprint_Race.Race_ID = Races.Race_ID
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    JOIN Results ON Sprint_Race.Race_ID = Results.Race_ID
    JOIN Drivers ON Sprint_Race.Driver_ID = Drivers.Driver_ID
    JOIN Teams ON Sprint_Race.Team_ID = Teams.Team_ID
    JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
    WHERE Championships.Year = ? AND Races.Round = ?
    ORDER BY Results.Finishing_Position ASC
    LIMIT ?;
    `

    const data = await executeQuery(sql, [year, today, limit])

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
        driverId: row[19],
        number: row[24],
        shortName: row[25],
        url: row[26],
        name: row[20],
        surname: row[21],
        nationality: row[22],
        birthday: row[23],
      },
      team: {
        teamId: row[27],
        teamName: row[28],
        nationality: row[29],
        firstAppareance: row[30],
        constructorsChampionships: row[31],
        driversChampionships: row[32],
        url: row[33],
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
        raceId: data[0][1],
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
