import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET(request: Request, context: any) {
  const { year } = context.params

  const sql = `
    SELECT DISTINCT Drivers.*
    FROM Drivers
    JOIN Results ON Drivers.Driver_ID = Results.Driver_ID
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
    drivers: processedData,
  })
}
