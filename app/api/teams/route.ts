import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET() {
  const data = await client.execute("SELECT * FROM teams")

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
