import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET(request: Request, context: any) {
  const { year, round } = context.params
  const limit = 1
  const sql = `SELECT Races.*
  FROM Races
  JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
  WHERE Championships.Year = ? AND Races.Round = ?
  LIMIT ?;
  `

  const data = await client.execute({
    sql: sql,
    args: [year, round, limit],
  })

  console.log(data)

  // Procesamos los datos
  const processedData = data.rows.map((row) => {
    return {
      Race_ID: row[0],
      Championship_ID: row[1],
      Race_Name: row[2],
      Race_Date: row[3],
      Circuit: row[4],
      Laps: row[5],
      Winner_ID: row[6],
      Team_Winner_ID: row[7],
      URL: row[8],
      Round: row[9],
    }
  })

  return NextResponse.json({
    race: processedData,
  })
}
