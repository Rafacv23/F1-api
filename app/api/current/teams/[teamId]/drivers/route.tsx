import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getYear } from "@/lib/utils"
import { executeQuery } from "@/lib/executeQuery"

export const revalidate = 60

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const limit = queryParams.get("limit") || 4
  try {
    const year = getYear()
    const { teamId } = context.params // Captura los parámetros year y driverId de la URL
    const sql = `
    SELECT
    r.Result_ID,
    ra.Race_ID,
    c.Year,
    t.*,
    d.*
  FROM Results AS r
  INNER JOIN Races AS ra ON r.Race_ID = ra.Race_ID
  INNER JOIN Championships AS c ON ra.Championship_ID = c.Championship_ID
  INNER JOIN Teams AS t ON r.Team_ID = t.Team_ID
  INNER JOIN Drivers AS d ON r.Driver_ID = d.Driver_ID
  WHERE
    c.Year = ? AND
    r.Team_ID = ?

    GROUP BY d.Driver_ID
    ORDER BY d.Name
    LIMIT ?;  
    `

    const data = await executeQuery(sql, [year, teamId, limit])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No team or drivers found for this year and team ID."
      )
    }

    // Procesamos los datos
    const processedData = data.map((row) => {
      return {
        driver: {
          driverId: row.Driver_ID,
          name: row.Name,
          surname: row.Surname,
          nationality: row.Nationality,
          birthday: row.Birthday,
          number: row.Number,
          shortName: row.Short_Name,
          url: row.URL,
        },
      }
    })

    const teamData = data.map((row) => {
      return {
        teamId: row.Team_ID,
        teamName: row.Team_Name,
        country: row.Team_Nationality,
        firstAppareance: row.First_Appeareance,
        constructorsChampionships: row.Constructors_Championships,
        driversChampionships: row.Drivers_Championships,
        url: row[9],
      }
    })

    return NextResponse.json({
      api: SITE_URL,
      url: request.url,
      total: processedData.length,
      limit: limit,
      season: year,
      teamId: teamId,
      team: teamData[0],
      drivers: processedData,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
