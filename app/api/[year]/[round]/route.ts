import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export const revalidate = 60

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
    const processedData = data.map((row) => {
      return {
        raceId: row[0],
        championshipId: row[1],
        raceName: row[2],
        schedule: {
          race: {
            date: row[3],
            time: row[10],
          },
          qualy: {
            date: row[11],
            time: row[17],
          },
          fp1: {
            date: row[12],
            time: row[18],
          },
          fp2: {
            date: row[13],
            time: row[19],
          },
          fp3: {
            date: row[14],
            time: row[20],
          },
          sprintQualy: {
            date: row[15],
            time: row[21],
          },
          sprintRace: {
            date: row[16],
            time: row[22],
          },
        },
        circuit: {
          // Circuit info
          circuitId: row[23],
          circuitName: row[24],
          country: row[25],
          city: row[26],
          circuitLength: row[27] + "km",
          lapRecord: row[28],
          firstParticipationYear: row[29],
          corners: row[30],
          fastestLapDriverId: row[31],
          fastestLapTeamId: row[32],
          fastestLapYear: row[33],
          url: row[34],
        },
        laps: row[5],
        winnerId: row[6],
        teamWinnerId: row[7],
        url: row[8],
        round: row[9],
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      round: round,
      race: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
