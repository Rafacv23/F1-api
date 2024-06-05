import { NextResponse } from "next/server"
import { SITE_NAME } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse, DriverChampionship } from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: number | string
  drivers_championship: any
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year } = context.params
    const sql = `SELECT Driver_Classifications.*, Drivers.*, Teams.*
    FROM Driver_Classifications
    JOIN Championships ON Driver_Classifications.Championship_ID = Championships.Championship_ID
    JOIN Drivers ON Driver_Classifications.Driver_ID = Drivers.Driver_ID
    JOIN Teams ON Driver_Classifications.Team_ID = Teams.Team_ID
    WHERE Championships.Year = ?
    ORDER BY Driver_Classifications.Points DESC, Driver_Classifications.Position ASC
    LIMIT ?;
    `

    const data = await executeQuery(sql, [year, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No drivers championship found for this year, try with other one."
      )
    }

    const processedData: DriverChampionship[] = data.map((row: any) => {
      const driver = {
        driverId: row.Driver_ID,
        name: row.Name,
        surname: row.Surname,
        nationality: row.Nationality,
        birthday: row.Birthday,
        number: row.Number,
        shortName: row.Short_Name,
        url: row.URL,
      }

      const team = {
        teamId: row.Team_ID,
        teamName: row.Team_Name,
        country: row.Team_Nationality,
        firstAppareance: row.First_Appareance,
        constructorsChampionships: row.Constructors_Championships,
        driversChampionships: row.Drivers_Championships,
        url: row.Team_URL,
      }

      return {
        classificationId: row.Classification_ID,
        championshipId: row.Championship_ID,
        driverId: row.Driver_ID,
        teamId: row.Team_ID,
        points: row.Points,
        position: row.Position,
        wins: row.Wins,
        driver: driver,
        team: team,
      }
    })

    const response: ApiResponse = {
      api: SITE_NAME,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      drivers_championship: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
