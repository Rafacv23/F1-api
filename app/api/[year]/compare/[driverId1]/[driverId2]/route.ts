import { db } from "@/db"
import { driverClassifications, drivers } from "@/db/migrations/schema"
import { SITE_URL } from "@/lib/constants"
import { BaseApiResponse } from "@/lib/definitions"
import { executeQuery } from "@/lib/executeQuery"
import { apiNotFound } from "@/lib/utils"
import { and, eq, or } from "drizzle-orm"
import { NextResponse } from "next/server"

export const revalidate = 120

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
  podiums: {
    [driverId: string]: number | null
  }
  poles: {
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
  MIN(r1.Grid_Position) AS Driver1_BestQualifying,
  MIN(r2.Grid_Position) AS Driver2_BestQualifying,
  SUM(CASE WHEN r1.Finishing_Position < r2.Finishing_Position THEN 1 ELSE 0 END) AS Driver1_BetterRaceFinish,
  SUM(CASE WHEN r2.Finishing_Position < r1.Finishing_Position THEN 1 ELSE 0 END) AS Driver2_BetterRaceFinish,
  MIN(r1.Finishing_Position) AS Driver1_BestRaceFinish,
  MIN(r2.Finishing_Position) AS Driver2_BestRaceFinish,
  SUM(CASE WHEN r1.Finishing_Position <= 10 THEN 1 ELSE 0 END) AS Driver1_PointFinishes,
  SUM(CASE WHEN r2.Finishing_Position <= 10 THEN 1 ELSE 0 END) AS Driver2_PointFinishes,
  SUM(CASE WHEN r1.Finishing_Position <= 3 THEN 1 ELSE 0 END) AS Driver1_Podiums,
  SUM(CASE WHEN r2.Finishing_Position <= 3 THEN 1 ELSE 0 END) AS Driver2_Podiums,
  SUM(CASE WHEN r1.Grid_Position = 1 THEN 1 ELSE 0 END) AS Driver1_Poles,
  SUM(CASE WHEN r2.Grid_Position = 1 THEN 1 ELSE 0 END) AS Driver2_Poles,
  SUM(CASE WHEN r1.Finishing_Position = 'NC' THEN 1 ELSE 0 END) AS Driver1_DNFs,
  SUM(CASE WHEN r2.Finishing_Position = 'NC' THEN 1 ELSE 0 END) AS Driver2_DNFs
FROM Results r1
JOIN Results r2 ON r1.Race_ID = r2.Race_ID AND r2.Driver_ID = ?
WHERE r1.Driver_ID = ? 
  AND r1.Race_ID LIKE CONCAT('%_', ?)
  AND r1.Grid_Position != 'NC'
  AND r2.Grid_Position != 'NC';
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
      podiums: {
        [driverId1]: result.Driver2_Podiums,
        [driverId2]: result.Driver1_Podiums,
      },
      poles: {
        [driverId1]: result.Driver2_Poles,
        [driverId2]: result.Driver1_Poles,
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

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=120, stale-while-revalidate=30",
      },
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
