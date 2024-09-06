import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound, getDay, getYear } from "@/lib/utils"
import { BaseApiResponse, Circuit } from "@/lib/definitions"

//revalidate

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
      SELECT Classifications.*, Races.*, Drivers.*, Teams.*, Circuits.*
      FROM Classifications
      JOIN Races ON Classifications.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      JOIN Drivers ON Classifications.Driver_ID = Drivers.Driver_ID
      JOIN Teams ON Classifications.Team_ID = Teams.Team_ID
      JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
      WHERE Championships.Year = ? AND Races.Race_Date <= ?
      ORDER BY Races.Race_Date DESC, Classifications.Grid_Position ASC
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
    const processedData = data.map((row: any) => ({
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
      total: data.length,
      season: year,
      races: {
        date: data[0][19],
        time: data[0][25],
        url: data[0][16],
        raceId: data[0][1],
        raceName: data[0][10],
        circuit: circuitData[0],
        qualyResults: processedData,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
