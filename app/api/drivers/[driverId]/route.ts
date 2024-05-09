import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"

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
      api: SITE_URL,
      // url: request.url,
      limit: limit,
      total: processedData.length,
      driver: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
