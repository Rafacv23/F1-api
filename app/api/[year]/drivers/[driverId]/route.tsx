import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"
import {
  BaseApiResponse,
  Driver,
  Drivers,
  Team,
  Teams,
} from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: string | number
  driver: Drivers
  team: Teams
  results: any
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year, driverId } = context.params // Captura los parámetros year y driverId de la URL
    const sql = `
      SELECT Results.*, Races.*, Drivers.*, Teams.*, Circuits.*,         
      Sprint_Race.Finishing_Position AS Sprint_Finishing_Position,
      Sprint_Race.Points_Obtained AS Sprint_Points_Obtained,
      Sprint_Race.Race_Time AS Sprint_Race_Time_Final,
      Sprint_Race.Grid_Position AS Sprint_Grid_Position,
      Sprint_Race.Retired AS Sprint_Retired
      FROM Results
      JOIN Races ON Results.Race_ID = Races.Race_ID
      LEFT JOIN Sprint_Race ON Results.Race_ID = Sprint_Race.Race_ID AND Results.Driver_ID = Sprint_Race.Driver_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      JOIN Drivers ON Results.Driver_ID = Drivers.Driver_ID
      JOIN Teams ON Results.Team_ID = Teams.Team_ID
      JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
      WHERE Championships.Year = ? AND Drivers.Driver_ID = ?
      ORDER BY Races.Round ASC
      LIMIT ?;
    `

    const data = await executeQuery(sql, [year, driverId, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No results found for this driver and year, try with another one."
      )
    }

    const driver = data.map((row: Driver) => {
      return {
        driverId: row.Driver_ID,
        name: `${row.Name} ${row.Surname}`,
        nationality: row.Nationality,
        birthday: row.Birthday,
        number: row.Number,
        shortName: row.Short_Name,
        url: row.URL,
      }
    })

    const team = data.map((row: Team) => {
      return {
        teamId: row.Team_ID,
        name: row.Team_Name,
        nationality: row.Team_Nationality,
        firstAppearance: row.First_Appareance,
        constructorsChampionships: row.Constructors_Championships,
        driversChampionships: row.Drivers_Championships,
      }
    })

    // Procesamos los datos
    const processedData = data.map((row: any) => {
      return {
        race: {
          raceId: row.Race_ID,
          name: row.Race_Name,
          date: row.Race_Date,
          circuit: {
            circuitId: row.Circuit_ID,
            name: row.Circuit_Name,
            country: row.Country,
            city: row.City,
            length: row.Circuit_Length,
            lapRecord: row.Lap_Record,
            firstParticipationYear: row.First_Participation_Year,
            numberOfCorners: row.Number_of_Corners,
            fastestLapDriverId: row.Fastest_Lap_Driver_ID,
            fastestLapTeamId: row.Fastest_Lap_Team_ID,
            fastestLapYear: row.Fastest_Lap_Year,
          },
        },
        result: {
          finishingPosition: row.Finishing_Position,
          gridPosition: row.Grid_Position,
          raceTime: row.Race_Time,
          pointsObtained: row.Points_Obtained,
          retired: row.Retired,
        },
        sprintResult:
          row.Sprint_Finishing_Position != null
            ? {
                finishingPosition: row.Sprint_Finishing_Position,
                gridPosition: row.Sprint_Grid_Position,
                raceTime: row.Sprint_Race_Time_Final,
                pointsObtained: row.Sprint_Points_Obtained,
                retired: row.Sprint_Retired,
              }
            : null,
        championship: {
          championshipId: row.Championship_ID,
          year: row.Year,
          round: row.Round,
        },
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: data.length,
      season: year,
      driver: driver[0],
      team: team[0],
      results: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
