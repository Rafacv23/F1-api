import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET(request: Request, context: any) {
  const { year } = context.params
  const limit = 20
  const sql = `SELECT Constructors_Classifications.*
  FROM Constructors_Classifications
  JOIN Championships ON Constructors_Classifications.Championship_ID = Championships.Championship_ID
  WHERE Championships.Year = ?
  ORDER BY Constructors_Classifications.Points DESC, Constructors_Classifications.Position ASC
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
      Team_ID: row[2],
      Points: row[3],
      Position: row[4],
    }
  })

  return NextResponse.json({
    constructors_championship: processedData,
  })
}
