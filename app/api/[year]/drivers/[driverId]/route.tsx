import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"

export const revalidate = 60

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year, driverId } = context.params // Captura los parámetros year y driverId de la URL
    const sql = `
      SELECT Results.*, Races.*, Drivers.*, Teams.*, Circuits.*
      FROM Results
      JOIN Races ON Results.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      JOIN Drivers ON Results.Driver_ID = Drivers.Driver_ID
      JOIN Teams ON Results.Team_ID = Teams.Team_ID
      JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
      WHERE Championships.Year = ? AND Drivers.Driver_ID = ?
      ORDER BY Races.Round ASC
      LIMIT ?;
    `

    const data = await executeQuery(sql, [year, driverId, limit])

    console.log(data)

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No results found for this driver and year, try with another one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
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
        driver: {
          driverId: row.Driver_ID,
          name: `${row.Name} ${row.Surname}`,
          nationality: row.Nationality,
          birthday: row.Birthday,
          number: row.Number,
          shortName: row.Short_Name,
          url: row.URL,
        },
        team: {
          teamId: row.Team_ID,
          name: row.Team_Name,
          nationality: row.Team_Nationality,
          firstAppearance: row.First_Appeareance,
          constructorsChampionships: row.Constructors_Championships,
          driversChampionships: row.Drivers_Championships,
        },
        result: {
          finishingPosition: row.Finishing_Position,
          gridPosition: row.Grid_Position,
          raceTime: row.Race_Time,
          pointsObtained: row.Points_Obtained,
          retired: row.Retired,
        },
        championship: {
          championshipId: row.Championship_ID,
          year: row.Year,
          round: row.Round,
        },
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      total: processedData.length,
      results: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
