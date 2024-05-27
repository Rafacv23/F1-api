import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export const revalidate = 60

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const sql = `SELECT * FROM Championships LIMIT ?;`

    const data = await executeQuery(sql, [limit])

    if (data.length === 0) {
      return apiNotFound(request, "No seasons found.")
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
      return {
        championshipId: row[0],
        championshipName: row[1],
        url: row[2],
        year: row[3],
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      championships: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
