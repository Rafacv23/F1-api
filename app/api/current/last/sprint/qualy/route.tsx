import { NextResponse } from "next/server"
import { CURRENT_YEAR, SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound, convertToTimezone, getDay } from "@/lib/utils"
import { BaseApiResponse, Circuit } from "@/lib/definitions"

export const revalidate = 600

interface ApiResponse extends BaseApiResponse {
  season: number | string
  timezone?: string
  races: any
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 20
  try {
    const { searchParams } = new URL(request.url)
    const timezone = searchParams.get("timezone")

    const year = CURRENT_YEAR
    const today = getDay()
    //const today = 5 testing endpoint
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

    const sprintQualyDate = data[0][23]
    const sprintQualyTime = data[0][29]

    const { date: localDate, time: localTime } = convertToTimezone(
      sprintQualyDate,
      sprintQualyTime,
      timezone
    )

    // Procesamos los datos
    const processedData = data.map((row: any) => ({
      sprintQualyId: row[0],
      raceId: row[1],
      driverId: row[2],
      teamId: row[3],
      sq1: row[4],
      sq2: row[5],
      sq3: row[6],
      gridPosition: row[7],
      driver: {
        driverId: row[2],
        number: row[39],
        name: row[35],
        surname: row[36],
        shortName: row[40],
        url: row[41],
        nationality: row[37],
        birthday: row[38],
      },
      team: {
        teamId: row[42],
        teamName: row[43],
        nationality: row[44],
        firstAppareance: row[45],
        constructorsChampionships: row[46],
        driversChampionships: row[47],
        url: row[48],
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
      timezone: timezone || undefined,
      total: data.length,
      season: year,
      races: {
        date: localDate,
        time: localTime,
        url: data[0][16],
        raceId: data[0][1],
        raceName: data[0][10],
        circuit: circuitData[0],
        sprintQualyResults: processedData,
      },
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=60",
      },
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
