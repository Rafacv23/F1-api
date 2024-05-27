import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export const revalidate = 60

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 30
  try {
    const sql = "SELECT * FROM teams LIMIT ?;"
    const data = await executeQuery(sql, [limit])

    // Verificar si se encontraron datos
    if (data.length === 0) {
      return apiNotFound(request, "No teams found.")
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
      teams: processedData,
    })
  } catch (error) {
    console.error("Error:", error) // Agregamos un mensaje de error para la consola
    return NextResponse.error()
  }
}
