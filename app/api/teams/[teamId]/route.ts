import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export const revalidate = 60

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
        teamId: row[0],
        teamName: row[1],
        country: row[2],
        firstAppareance: row[3],
        constructorsChampionships: row[4],
        driversChampionships: row[5],
        url: row[6],
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
