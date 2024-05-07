import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET(request: Request, context: any) {
  const { year } = context.params

  const sql = `
    SELECT DISTINCT Circuits.*
    FROM Circuits
    JOIN Races ON Circuits.Circuit_ID = Races.Circuit
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
      Circuit_ID: row[0],
      Circuit_Name: row[1],
      Country: row[2],
      City: row[3],
      Circuit_Length: row[4],
      Lap_Record: row[5],
      First_Participation_Year: row[6],
      Number_of_Corners: row[7],
      Fastest_Lap_Driver_ID: row[8],
      Fastest_Lap_Team_ID: row[9],
      Fastest_Lap_Year: row[10],
      Url: row[11],
    }
  })

  return NextResponse.json({
    circuits: processedData,
  })
}
