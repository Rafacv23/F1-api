import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound, getDay, getYear } from "@/lib/utils"

export const revalidate = 60

export async function GET(request: Request) {
  const year = new Date().getFullYear()
  const today = new Date().toISOString().split("T")[0]
  const limit = 1
  try {
    const sql = `SELECT Races.*, Circuits.*
    FROM Races
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
    WHERE Championships.Year = ? AND Races.Race_Date <= ?
    ORDER BY RACES.Race_Date DESC
    LIMIT ?;
    `

    const data = await executeQuery(sql, [year, today, limit])

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
        raceDate: row[3],
        circuit: {
          // Circuit info
          circuitId: row[10],
          circuitName: row[11],
          country: row[12],
          city: row[13],
          circuitLength: row[14] + "km",
          lapRecord: row[15],
          firstParticipationYear: row[16],
          corners: row[17],
          fastestLapDriverId: row[18],
          fastestLapTeamId: row[19],
          fastestLapYear: row[20],
          url: row[21],
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
      race: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
