import { db } from "@/db"
import { driverClassifications, drivers } from "@/db/migrations/schema"
import { SITE_URL } from "@/lib/constants"
import { BaseApiResponse } from "@/lib/definitions"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { and, eq, or } from "drizzle-orm"
import { NextResponse } from "next/server"

export const revalidate = 60

interface DriverStats {
  [driverId: string]: number
}

export interface ProcessedComparison {
  totalRaces: number
  championship: {
    totalPoints: {
      [driverId: string]: number | null
    }
    position: {
      [driverId: string]: number | null
    }
  }
  raceComparison: DriverStats
  qualifyingComparison: DriverStats
  wins: {
    [driverId: string]: number | null
  }
  pointFinishes: DriverStats
  bestRaceFinish: DriverStats
  bestGridPosition: DriverStats
  dnfs: DriverStats
}
interface ApiResponse extends BaseApiResponse {
  season: number | string
  championshipId: string
  drivers: DriverInfo[]
  comparison: ProcessedComparison
}

type DriverInfo = {
  driverId1?: string
  driverId2?: string
  name: string
  surname: string
  nationality: string
  birthday: string
  number: number | null
  shortName: string | null
  url: string | null
  teamId: string | null
}

export async function GET(request: Request, context: any) {
  try {
    const { year, driverId1, driverId2 } = context.params

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
      .innerJoin(drivers, eq(drivers.driverId, driverClassifications.driverId))
      .where(
        and(
          eq(driverClassifications.championshipId, `f1_${year}`),
          or(
            eq(driverClassifications.driverId, driverId1),
            eq(driverClassifications.driverId, driverId2)
          )
        )
      )
      .limit(2)

    console.log(driversPointsData)

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

    const driver1Points = driversPointsData[0].Driver_Classifications.points
    const driver2Points = driversPointsData[1].Driver_Classifications.points

    const driversInfo = [
      {
        driverId1: driverId1,
        name: driversPointsData[0].Drivers.name,
        surname: driversPointsData[0].Drivers.surname,
        nationality: driversPointsData[0].Drivers.nationality,
        birthday: driversPointsData[0].Drivers.birthday,
        number: driversPointsData[0].Drivers.number,
        shortName: driversPointsData[0].Drivers.shortName,
        url: driversPointsData[0].Drivers.url,
        teamId: driversPointsData[0].Driver_Classifications.teamId,
      },
      {
        driverId2: driverId2,
        name: driversPointsData[1].Drivers.name,
        surname: driversPointsData[1].Drivers.surname,
        nationality: driversPointsData[1].Drivers.nationality,
        birthday: driversPointsData[1].Drivers.birthday,
        number: driversPointsData[1].Drivers.number,
        shortName: driversPointsData[1].Drivers.shortName,
        url: driversPointsData[1].Drivers.url,
        teamId: driversPointsData[1].Driver_Classifications.teamId,
      },
    ]

    const processedData: ProcessedComparison = {
      totalRaces: result.Total_Races,
      championship: {
        totalPoints: {
          [driverId1]: driver1Points,
          [driverId2]: driver2Points,
        },
        position: {
          [driverId1]: driversPointsData[0].Driver_Classifications.position,
          [driverId2]: driversPointsData[1].Driver_Classifications.position,
        },
      },
      raceComparison: {
        [driverId1]: result.Driver2_BetterRaceFinish,
        [driverId2]: result.Driver1_BetterRaceFinish,
      },
      qualifyingComparison: {
        [driverId1]: result.Driver2_BetterQualifying,
        [driverId2]: result.Driver1_BetterQualifying,
      },
      wins: {
        [driverId1]: driversPointsData[0].Driver_Classifications.wins,
        [driverId2]: driversPointsData[1].Driver_Classifications.wins,
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
      season: year,
      championshipId: `f1_${year}`,
      drivers: driversInfo,
      comparison: processedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
