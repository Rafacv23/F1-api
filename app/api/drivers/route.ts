import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const sql = "SELECT * FROM drivers LIMIT ?"

    const data = await executeQuery(sql, [limit])

    if (data.length === 0) {
      return apiNotFound(request, "No drivers found.")
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
      return {
        driverId: row[0],
        name: row[1],
        surname: row[2],
        country: row[3],
        birthday: row[4],
        number: row[5],
        shortName: row[6],
        url: row[7],
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      drivers: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
