import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"

export const revalidate = 60

export async function GET(request: Request, context: any) {
  try {
    const { driverId } = context.params // Captura el parámetro driverId de la URL
    const sql = "SELECT * FROM Drivers WHERE Driver_Id = ? LIMIT ?"
    const limit = 1

    const data = await executeQuery(sql, [driverId, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No driver found for this id, try with other one."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
      return {
        driverId: row[0],
        name: row[1],
        surname: row[2],
        country: row[3],
        birthday: row[4],
        number: row[5],
        shortName: row[6],
        url: row[7],
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      limit: limit,
      total: processedData.length,
      driver: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
