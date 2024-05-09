import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const limit = 30
    const sql = `SELECT * FROM Championships LIMIT ?;`

    const data = await executeQuery(sql, [limit])

    if (data.length === 0) {
      return apiNotFound(request, "No seasons found.")
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
      return {
        Championship_ID: row[0],
        Championship_Name: row[1],
        Url: row[2],
        Year: row[3],
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      ChampionshipTable: {
        Championships: processedData,
      },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
