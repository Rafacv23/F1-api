import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET(request: Request, context: any) {
  const { year, round } = context.params
  const limit = 30
  const sql = `
    SELECT Classifications.*
    FROM Classifications
    JOIN Races ON Classifications.Race_ID = Races.Race_ID
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    WHERE Championships.Year = ? AND Races.Round = ?
    ORDER BY Classifications.Grid_Position ASC
    LIMIT ?;
  `

  const data = await client.execute({
    sql: sql,
    args: [year, round, limit],
  })

  // Procesamos los datos
  const processedData = data.rows.map((row) => {
    return {
      Qualification_ID: row[0],
      Race_ID: row[1],
      Driver_ID: row[2],
      Team_ID: row[3],
      Q1_Time: row[4],
      Q2_Time: row[5],
      Q3_Time: row[6],
      Grid_Position: row[7],
    }
  })

  return NextResponse.json({
    qualifying_results: processedData,
  })
}
