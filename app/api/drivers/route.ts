import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import {
  BaseApiResponse,
  Driver,
  Drivers,
  ProcessedDrivers,
} from "@/lib/definitions"
import { DatabaseZap } from "lucide-react"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  drivers: ProcessedDrivers
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const sql = "SELECT * FROM drivers LIMIT ?"

    const data: Drivers = await executeQuery(sql, [limit])

    if (data.length === 0) {
      return apiNotFound(request, "No drivers found.")
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
      total: data.length,
      drivers: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
