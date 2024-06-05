import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { SITE_URL } from "@/lib/constants"
import { BaseApiResponse, Driver, ProcessedDrivers } from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: string | number
  drivers: ProcessedDrivers
}
export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const { year } = context.params
    const sql = `
      SELECT DISTINCT Drivers.*
      FROM Drivers
      JOIN Results ON Drivers.Driver_ID = Results.Driver_ID
      JOIN Races ON Results.Race_ID = Races.Race_ID
      JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
      WHERE Championships.Year = ? LIMIT ?;
    `

    const data = await executeQuery(sql, [year, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No drivers found fot this year, try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row: Driver) => {
      return {
        driverId: row.Driver_ID,
        name: row.Name,
        surname: row.Surname,
        country: row.Nationality,
        birthday: row.Birthday,
        number: row.Number,
        shortName: row.Short_Name,
        url: row.URL,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      season: year,
      drivers: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
