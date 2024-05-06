import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET(request: Request, context: any) {
  const { year } = context.params
  const limit = 30
  const sql = `SELECT Driver_Classifications.*
  FROM Driver_Classifications
  JOIN Championships ON Driver_Classifications.Championship_ID = Championships.Championship_ID
  WHERE Championships.Year = ?
  ORDER BY Driver_Classifications.Points DESC, Driver_Classifications.Position ASC
  LIMIT ?;
  `

  const data = await client.execute({
    sql: sql,
    args: [year, limit],
  })

  // Procesamos los datos
  const processedData = data.rows.map((row) => {
    return {
      Classification_ID: row[0],
      Championship_ID: row[1],
      Driver_ID: row[2],
      Team_ID: row[3],
      Points: row[4],
      Position: row[5],
    }
  })

  return NextResponse.json({
    drivers_championship: processedData,
  })
}
