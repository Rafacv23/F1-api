import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"
import { SITE_URL } from "@/lib/constants"

export async function GET(request: Request, context: any) {
  const limit = 30

  const sql = `SELECT * FROM Championships LIMIT ?;`

  const data = await client.execute({
    sql: sql,
    args: [limit],
  })

  // Procesamos los datos
  const processedData = data.rows.map((row) => {
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
}
