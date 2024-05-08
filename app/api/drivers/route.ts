import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"
import { SITE_URL } from "@/lib/constants"

export async function GET(request: Request) {
  const limit = 30
  const sql = "SELECT * FROM drivers LIMIT ?"
  const data = await client.execute({ sql: sql, args: [limit] })

  // Procesamos los datos
  const processedData = data.rows.map((row) => {
    return {
      Driver_ID: row[0],
      Name: row[1],
      Surname: row[2],
      Nationality: row[3],
      Birthday: row[4],
      Number: row[5],
      Short_Name: row[6],
      URL: row[7],
    }
  })

  return NextResponse.json({
    api: SITE_URL,
    url: request.url,
    limit: limit,
    total: processedData.length,
    drivers: processedData,
  })
}
