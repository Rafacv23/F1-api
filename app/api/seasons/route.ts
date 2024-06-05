import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import {
  BaseApiResponse,
  Championship,
  Championships,
  ProcessedChampionships,
} from "@/lib/definitions"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  championships: ProcessedChampionships
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const sql = `SELECT * FROM Championships LIMIT ?;`

    const data: Championships = await executeQuery(sql, [limit])

    if (data.length === 0) {
      return apiNotFound(request, "No seasons found.")
    }

    // Procesamos los datos
    const processedData = data.map((row: Championship) => {
      return {
        championshipId: row.Championship_ID,
        championshipName: row.Championship_Name,
        url: row.Url,
        year: row.Year,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      championships: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
