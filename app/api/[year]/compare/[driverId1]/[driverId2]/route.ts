import { db } from "@/db"
import { driverClassifications, results } from "@/db/migrations/schema"
import { SITE_URL } from "@/lib/constants"
import { BaseApiResponse, Drivers } from "@/lib/definitions"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { and, eq, or } from "drizzle-orm"
import { NextResponse } from "next/server"

export const revalidate = 60

interface DriverStats {
  [driverId: string]: number
}

// Definimos el tipo para ProcessedComparison
export interface ProcessedComparison {
  totalRaces: number
  raceComparison: DriverStats
  qualifyingComparison: DriverStats
  totalPoints: DriverStats
  pointFinishes: DriverStats
  bestRaceFinish: DriverStats
  bestGridPosition: DriverStats
  dnfs: DriverStats
}

interface ApiResponse extends BaseApiResponse {
  season: number | string
  drivers: Drivers
  comparison: ProcessedComparison
}

export async function GET(request: Request, context: any) {
  try {
    const { year, driverId1, driverId2 } = context.params
    const limit = 1

    const sql = `
    SELECT 
  COUNT(r1.Race_ID) AS Total_Races,
  SUM(CASE WHEN r1.Grid_Position < r2.Grid_Position THEN 1 ELSE 0 END) AS Driver1_BetterQualifying, 
  SUM(CASE WHEN r2.Grid_Position < r1.Grid_Position THEN 1 ELSE 0 END) AS Driver2_BetterQualifying,
  MIN(CASE WHEN r1.Grid_Position != 'NC' THEN r1.Grid_Position ELSE NULL END) AS Driver1_BestQualifying,
  MIN(CASE WHEN r2.Grid_Position != 'NC' THEN r2.Grid_Position ELSE NULL END) AS Driver2_BestQualifying,
  SUM(CASE WHEN r1.Finishing_Position < r2.Finishing_Position AND r1.Finishing_Position != 'NC' AND r2.Finishing_Position != 'NC' THEN 1 ELSE 0 END) AS Driver1_BetterRaceFinish,
  SUM(CASE WHEN r2.Finishing_Position < r1.Finishing_Position AND r1.Finishing_Position != 'NC' AND r2.Finishing_Position != 'NC' THEN 1 ELSE 0 END) AS Driver2_BetterRaceFinish,
  MIN(CASE WHEN r1.Finishing_Position != 'NC' THEN r1.Finishing_Position ELSE NULL END) AS Driver1_BestRaceFinish,
  MIN(CASE WHEN r2.Finishing_Position != 'NC' THEN r2.Finishing_Position ELSE NULL END) AS Driver2_BestRaceFinish,
  SUM(CASE WHEN r1.Finishing_Position != 'NC' THEN r1.Points_Obtained ELSE 0 END) AS Driver1_TotalPoints,
  SUM(CASE WHEN r2.Finishing_Position != 'NC' THEN r2.Points_Obtained ELSE 0 END) AS Driver2_TotalPoints,
  SUM(CASE WHEN r1.Finishing_Position = 'NC' THEN 1 ELSE 0 END) AS Driver1_DNFs,
  SUM(CASE WHEN r2.Finishing_Position = 'NC' THEN 1 ELSE 0 END) AS Driver2_DNFs,
  SUM(CASE WHEN r1.Finishing_Position <= 10 AND r1.Finishing_Position != 'NC' THEN 1 ELSE 0 END) AS Driver1_PointFinishes,
  SUM(CASE WHEN r2.Finishing_Position <= 10 AND r2.Finishing_Position != 'NC' THEN 1 ELSE 0 END) AS Driver2_PointFinishes
FROM Results r1
JOIN Results r2 ON r1.Race_ID = r2.Race_ID AND r2.Driver_ID = ?
WHERE r1.Driver_ID = ? 
  AND r1.Race_ID LIKE CONCAT('%_', ?);
  `

    const driversPointsData = await db
      .select()
      .from(driverClassifications)
      .where(
        and(
          eq(driverClassifications.championshipId, `f1_${year}`),
          or(
            eq(driverClassifications.driverId, driverId1),
            eq(driverClassifications.driverId, driverId2)
          )
        )
      )

    const data = await executeQuery(sql, [driverId1, driverId2, year])

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No results found for this drivers. Try with others, or other year."
      )
    }

    const result = data[0]

    const pointsMap = new Map<string, number>()
    driversPointsData.forEach((entry: any) => {
      pointsMap.set(entry.driverId, entry.points)
    })

    // Retrieve the points for driverId1 and driverId2
    const driver1Points = pointsMap.get(driverId1) || 0
    const driver2Points = pointsMap.get(driverId2) || 0

    const driversInfo: any = {
      driverId1,
      driverId2,
    }

    const processedData: ProcessedComparison = {
      totalRaces: result.Total_Races,
      raceComparison: {
        [driverId1]: result.Driver2_BetterRaceFinish,
        [driverId2]: result.Driver1_BetterRaceFinish,
      },
      qualifyingComparison: {
        [driverId1]: result.Driver2_BetterQualifying,
        [driverId2]: result.Driver1_BetterQualifying,
      },
      totalPoints: {
        [driverId1]: driver1Points,
        [driverId2]: driver2Points,
      },
      pointFinishes: {
        [driverId1]: result.Driver2_PointFinishes,
        [driverId2]: result.Driver1_PointFinishes,
      },
      bestRaceFinish: {
        [driverId1]: result.Driver2_BestRaceFinish,
        [driverId2]: result.Driver1_BestRaceFinish,
      },
      bestGridPosition: {
        [driverId1]: result.Driver2_BestQualifying,
        [driverId2]: result.Driver1_BestQualifying,
      },
      dnfs: {
        [driverId1]: result.Driver2_DNFs,
        [driverId2]: result.Driver1_DNFs,
      },
    }

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      season: year,
      drivers: driversInfo,
      comparison: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
