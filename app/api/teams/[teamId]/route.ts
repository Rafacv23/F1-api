import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export async function GET(request: Request, context: any) {
  try {
    const { teamId } = context.params // Captura el parámetro teamId de la URL
    const limit = 1
    const sql = "SELECT * FROM Teams WHERE Team_Id = ? LIMIT ?"

    const data = await executeQuery(sql, [teamId, limit])

    if (data.length === 0) {
      return apiNotFound(request, "No teams found for this id, try with other.")
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
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
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      team: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
