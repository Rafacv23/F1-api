import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { getYear } from "@/lib/utils"

export const revalidate = 60

export async function GET(request: Request) {
  const year = getYear()
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const sql = `SELECT Races.*, Circuits.*, Drivers.*, Teams.*
    FROM Races
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
    JOIN Drivers ON Races.Winner_ID = Drivers.Driver_ID
    JOIN Teams ON Races.Team_Winner_ID = Teams.Team_ID
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
    const processedData = data.map((row) => {
      const circuitData = {
        circuitId: row[10],
        circuitName: row[11],
        country: row[12],
        city: row[13],
        circuitLength: row[14] + "km",
        lapRecord: row[15],
        firstParticipationYear: row[16],
        numberOfCorners: row[17],
        fastestLapDriverId: row[18],
        fastestLapTeamId: row[19],
        fastestLapYear: row[20],
        url: row[21],
      }

      const driverData = {
        driverId: row[22],
        name: row[23],
        surname: row[24],
        country: row[25],
        birthday: row[26],
        number: row[27],
        shortName: row[28],
        url: row[29],
      }

      const teamData = {
        teamId: row[30],
        teamName: row[31],
        nationality: row[32],
        firstAppareance: row[33],
        constructorsChampionships: row[34],
        driversChampionships: row[35],
        url: row[36],
      }

      return {
        raceId: row[0],
        championshipId: row[1],
        raceName: row[2],
        raceDate: row[3],
        circuit: circuitData,
        laps: row[5],
        winner: driverData,
        teamWinner: teamData,
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
      races: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
