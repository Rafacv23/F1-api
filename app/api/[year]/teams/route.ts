import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET(request: Request, context: any) {
  const { year } = context.params

  const sql = `
    SELECT DISTINCT Teams.*
    FROM Teams
    JOIN Results ON Teams.Team_ID = Results.Team_ID
    JOIN Races ON Results.Race_ID = Races.Race_ID
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    WHERE Championships.Year = ?;
  `

  const data = await client.execute({
    sql: sql,
    args: [year],
  })

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
    teams: processedData,
  })
}
