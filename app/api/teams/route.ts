import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const queryParams = new URL(request.url).searchParams
    const limit = queryParams.get("limit") || 30
    const sql = "SELECT * FROM teams LIMIT ?;"
    const data = await executeQuery(sql, [limit])

    // Verificar si se encontraron datos
    /*if (data.length === 0) {
      return apiNotFound(request, "No teams found.")
    }
    */
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
      teams: processedData,
    })
  } catch (error) {
    console.error("Error:", error) // Agregamos un mensaje de error para la consola
    return NextResponse.error()
  }
}
