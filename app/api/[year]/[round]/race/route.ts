import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET(request: Request, context: any) {
  const { year, round } = context.params
  const limit = 30
  const sql = `
    SELECT Results.*
    FROM Results
    JOIN Races ON Results.Race_ID = Races.Race_ID
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    WHERE Championships.Year = ? AND Races.Round = ?
    ORDER BY Results.Finishing_Position ASC
    LIMIT ?;
  `

  const data = await client.execute({
    sql: sql,
    args: [year, round, limit],
  })

  // Procesamos los datos
  const processedData = data.rows.map((row) => {
    return {
      Result_ID: row[0],
      Race_ID: row[1],
      Driver_ID: row[2],
      Team_ID: row[3],
      Finishing_Position: row[4],
      Grid_Position: row[5],
      Race_Time: row[6],
      Retired: row[7],
      Points: row[8],
    }
  })

  return NextResponse.json({
    race_results: processedData,
  })
}
