import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { getYear } from "@/lib/utils"
import {
  BaseApiResponse,
  ProcessedCircuit,
  ProcessedDriver,
  ProcessedFastLap,
  ProcessedTeam,
  Race,
  Races,
} from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: number | string
  races: Race[]
}

export async function GET(request: Request) {
  const year = getYear()
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const sql = `SELECT Races.*, Circuits.*, Drivers.*, Teams.*
    FROM Races
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
    LEFT JOIN Drivers ON Races.Winner_ID = Drivers.Driver_ID
    LEFT JOIN Teams ON Races.Team_Winner_ID = Teams.Team_ID
    WHERE Championships.Year = ?
    ORDER BY Races.Round ASC
    LIMIT ?;`

    const data = await executeQuery(sql, [year, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No seasons found for this year, try with other one."
      )
    }

    // Procesamos los datos
    const processedData: Races = data.map((row: any) => {
      const circuitData: ProcessedCircuit = {
        circuitId: row.Circuit_ID,
        circuitName: row.Circuit_Name,
        country: row.Country,
        city: row.City,
        circuitLength: row.Circuit_Length + "km",
        lapRecord: row.Lap_Record,
        firstParticipationYear: row.First_Participation_Year,
        corners: row.Number_Of_Corners,
        fastestLapDriverId: row.Fastest_Lap_Driver_ID,
        fastestLapTeamId: row.Fastest_Lap_Team_ID,
        fastestLapYear: row.Fastest_Lap_Year,
        url: row.Circuit_URL,
      }

      const fastLapData: ProcessedFastLap = {
        fast_lap: row.fast_lap,
        fast_lap_driver_id: row.fast_lap_driver_id,
        fast_lap_team_id: row.fast_lap_team_id,
      }

      const driverData: ProcessedDriver | null = row.Driver_ID
        ? {
            driverId: row.Driver_ID,
            name: row.Name,
            surname: row.Surname,
            country: row.Nationality,
            birthday: row.Birthday,
            number: row.Number,
            shortName: row.Short_Name,
            url: row.URL,
          }
        : null

      const teamData: ProcessedTeam | null = row.Team_ID
        ? {
            teamId: row.Team_ID,
            teamName: row.Team_Name,
            country: row.Team_Nationality,
            firstAppareance: row.First_Appareance,
            constructorsChampionships: row.Constructors_Championships,
            driversChampionships: row.Drivers_Championships,
            url: row.Team_URL,
          }
        : null

      return {
        raceId: row.Race_ID,
        championshipId: row.Championship_ID,
        raceName: row.Race_Name,
        schedule: {
          race: { date: row.Race_Date, time: row.Race_Time },
          qualy: { date: row.Qualy_Date, time: row.Qualy_Time },
          fp1: { date: row.FP1_Date, time: row.FP1_Time },
          fp2: { date: row.FP2_Date, time: row.FP2_Time },
          fp3: { date: row.FP3_Date, time: row.FP3_Time },
          sprintQualy: {
            date: row.Sprint_Qualy_Date,
            time: row.Sprint_Qualy_Time,
          },
          sprintRace: {
            date: row.Sprint_Race_Date,
            time: row.Sprint_Race_Time,
          },
        },
        laps: row.Laps,
        round: row.Round,
        fast_lap: fastLapData,
        url: row.Url,
        circuit: circuitData,
        winner: driverData,
        teamWinner: teamData,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      races: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
