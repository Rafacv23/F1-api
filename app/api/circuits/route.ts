import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"
import { SITE_URL } from "@/lib/constants"

export async function GET(request: Request) {
  const limit = 30
  const sql = `SELECT * FROM Circuits`
  const data = await client.execute(sql)

  // Procesamos los datos
  const processedData = data.rows.map((row) => {
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
    url: request.url,
    limit: limit,
    total: processedData.length,
    circuits: processedData,
  })
}
