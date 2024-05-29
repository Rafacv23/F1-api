import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export const revalidate = 60

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 20
  try {
    const { year, round } = context.params

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

    const data = await executeQuery(sql, [year, round, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No sprint race results found for this round. Try with other one."
      )
    }

    // Procesamos los datos de los resultados
    const processedData = data.map((row) => ({
      sprintRaceId: row[0],
      position: row[4],
      points: row[9],
      driver: {
        driverId: row[20],
        number: row[25],
        shortName: row[26],
        url: row[27],
        name: row[21],
        surname: row[22],
        nationality: row[23],
        birthday: row[24],
      },
      team: {
        teamId: row[28],
        teamName: row[29],
        nationality: row[30],
        firstAppareance: row[31],
        constructorsChampionships: row[32],
        driversChampionships: row[33],
        url: row[34],
      },
      grid: row[5],
      laps: row[6],
      time: row[7],
      retired: row[8],
    }))

    processedData.sort((a: any, b: any) => a.position - b.position)

    // Obtener los datos del circuito
    const circuitData = {
      circuitId: data[0][35],
      circuitName: data[0][36],
      country: data[0][37],
      city: data[0][38],
      circuitLength: data[0][39] + "km",
      lapRecord: data[0][40],
      firstParticipationYear: data[0][41],
      corners: data[0][42],
      fastestLapDriverId: data[0][43],
      fastestLapTeamId: data[0][44],
      fastestLapYear: data[0][45],
      url: data[0][46],
    }

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: data.length,
      raceTable: {
        season: year,
        round: round,
        sprintRace: [
          {
            url: data[0][12],
            raceName: data[0][12],
            circuit: circuitData,
            results: processedData,
          },
        ],
      },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
