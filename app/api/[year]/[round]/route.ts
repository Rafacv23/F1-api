import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse, ProcessedRaces } from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: number | string
  round: number | string
  race: ProcessedRaces
}

export async function GET(request: Request, context: any) {
  try {
    const { year, round } = context.params
    const limit = 1
    const sql = `SELECT Races.*, Circuits.*
    FROM Races
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
    WHERE Championships.Year = ? AND Races.Round = ?
    LIMIT ?;
    `

    const data = await executeQuery(sql, [year, round, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No race found for this round. Try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row: any) => {
      return {
        raceId: row.Race_ID,
        championshipId: row.Championship_ID,
        raceName: row.Race_Name,
        schedule: {
          race: {
            date: row.Race_Date,
            time: row.Race_Time,
          },
          qualy: {
            date: row.Qualy_Date,
            time: row.Qualy_Time,
          },
          fp1: {
            date: row.FP1_Date,
            time: row.FP1_Time,
          },
          fp2: {
            date: row.FP2_Date,
            time: row.FP2_Time,
          },
          fp3: {
            date: row.FP3_Date,
            time: row.FP3_Time,
          },
          sprintQualy: {
            date: row.Sprint_Qualy_Date,
            time: row.Sprint_Qualy_Time,
          },
          sprintRace: {
            date: row.Sprint_Race_Date,
            time: row.Sprint_Race_Time,
          },
        },
        circuit: {
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
        },
        laps: row.Laps,
        winnerId: row.Winner_ID,
        teamWinnerId: row.Team_Winner_ID,
        url: row.Url,
        round: row.Round,
        fast_lap: {
          fast_lap: row.fast_lap,
          driverId: row.fast_lap_driver_id,
          teamId: row.fast_lap_team_id,
        },
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      round: round,
      race: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
