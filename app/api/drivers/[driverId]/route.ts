import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"
import {
  BaseApiResponse,
  Driver,
  Drivers,
  ProcessedDrivers,
} from "@/lib/definitions"

export const revalidate = 60

interface ApiResonse extends BaseApiResponse {
  driver: ProcessedDrivers
}

export async function GET(request: Request, context: any) {
  try {
    const { driverId } = context.params // Captura el parámetro driverId de la URL
    const sql = "SELECT * FROM Drivers WHERE Driver_Id = ? LIMIT ?"
    const limit = 1

    const data: Drivers = await executeQuery(sql, [driverId, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No driver found for this id, try with other one."
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

    const response: ApiResonse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      driver: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
