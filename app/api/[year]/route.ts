import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export const revalidate = 60

export async function GET(request: Request, context: any) {
  try {
    const { year } = context.params
    const queryParams = new URL(request.url).searchParams
    const limit = queryParams.get("limit") || 30
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

    console.log(data)

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No seasons found for this year, try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
      const circuitData = {
        circuitId: row[23],
        circuitName: row[24],
        country: row[25],
        city: row[26],
        circuitLength: row[27] + "km",
        lapRecord: row[28],
        firstParticipationYear: row[29],
        numberOfCorners: row[30],
        fastestLapDriverId: row[31],
        fastestLapTeamId: row[32],
        fastestLapYear: row[34],
        url: row[34],
      }

      const driverData = {
        driverId: row[35],
        name: row[36],
        surname: row[37],
        country: row[38],
        birthday: row[39],
        number: row[40],
        shortName: row[41],
        url: row[42],
      }

      const teamData = {
        teamId: row[43],
        teamName: row[44],
        nationality: row[45],
        firstAppareance: row[46],
        constructorsChampionships: row[47],
        driversChampionships: row[48],
        url: row[49],
      }

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
        laps: row[5],
        round: row[9],
        url: row[8],
        circuit: circuitData,
        winner: driverData,
        teamWinner: teamData,
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
