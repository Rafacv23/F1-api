import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"

export async function GET() {
  const data = await client.execute("SELECT * FROM drivers")

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
