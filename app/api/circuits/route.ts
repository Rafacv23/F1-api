import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const queryParams = new URL(request.url).searchParams
    const limit = queryParams.get("limit") || 30
    // const limit = 30
    const sql = `SELECT * FROM Circuits LIMIT ?`
    const data = await executeQuery(sql, [limit])

    if (data.length === 0) {
      return apiNotFound(request, "No circuits found.")
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
      return {
        Circuit_ID: row[0],
        Circuit_Name: row[1],
        Country: row[2],
        City: row[3],
        Circuit_Length: row[4],
        Lap_Record: row[5],
        First_Participation_Year: row[6],
        Number_of_Corners: row[7],
        Fastest_Lap_Driver_ID: row[8],
        Fastest_Lap_Team_ID: row[9],
        Fastest_Lap_Year: row[10],
        Url: row[11],
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      // url: request.url,
      limit: limit,
      total: processedData.length,
      circuits: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
