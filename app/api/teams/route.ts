import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"
import { SITE_URL } from "@/lib/constants"

export async function GET(request: Request) {
  const limit = 30
  const sql = "SELECT * FROM teams LIMIT ?;"

  const data = await client.execute({ sql: sql, args: [limit] })

  // Procesamos los datos
  const processedData = data.rows.map((row) => {
    return {
      Team_ID: row[0],
      Team_Name: row[1],
      Team_Nationality: row[2],
      First_Appareance: row[3],
      Constructors_Championships: row[4],
      Drivers_Championships: row[5],
      URL: row[6],
    }
  })

  return NextResponse.json({
    api: SITE_URL,
    url: request.url,
    limit: limit,
    total: processedData.length,
    teams: processedData,
  })
}
