import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

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
    seasons: processedData,
  })
}
