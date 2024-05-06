import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET(request: Request, context: any) {
  const { teamId } = context.params // Captura el parámetro teamId de la URL

  const data = await client.execute({
    sql: "SELECT * FROM Teams WHERE Team_Id = ?",
    args: [teamId],
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
    team: processedData,
  })
}
