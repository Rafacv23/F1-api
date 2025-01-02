import { NextResponse } from "next/server"
import { SITE_NAME } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { driverClassifications, drivers, teams } from "@/db/migrations/schema"
import { asc, eq } from "drizzle-orm"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: number | string
  championshipId: string
  drivers_championship: any
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const { year } = context.params

    const driverStandings = await db
      .select()
      .from(driverClassifications)
      .innerJoin(drivers, eq(driverClassifications.driverId, drivers.driverId))
      .innerJoin(teams, eq(driverClassifications.teamId, teams.teamId))
      .where(eq(driverClassifications.championshipId, `f1_${year}`))
      .orderBy(asc(driverClassifications.position))
      .limit(limit)
      .offset(offset)

    if (driverStandings.length === 0) {
      return apiNotFound(
        request,
        "No drivers championship found for this year, try with other one."
      )
    }

    const formattedDriverStandings = driverStandings.map((driver) => {
      return {
        classificationId: driver.Driver_Classifications.classificationId,
        driverId: driver.Driver_Classifications.driverId,
        teamId: driver.Driver_Classifications.teamId,
        points: driver.Driver_Classifications.points,
        position: driver.Driver_Classifications.position,
        wins: driver.Driver_Classifications.wins,
        driver: {
          name: driver.Drivers.name,
          surname: driver.Drivers.surname,
          nationality: driver.Drivers.nationality,
          birthday: driver.Drivers.birthday,
          number: driver.Drivers.number,
          shortName: driver.Drivers.shortName,
          url: driver.Drivers.url,
        },
        team: {
          teamId: driver.Teams.teamId,
          teamName: driver.Teams.teamName,
          country: driver.Teams.teamNationality,
          firstAppareance: driver.Teams.firstAppeareance,
          constructorsChampionships: driver.Teams.constructorsChampionships,
          driversChampionships: driver.Teams.driversChampionships,
          url: driver.Teams.url,
        },
      }
    })

    const response: ApiResponse = {
      api: SITE_NAME,
      url: request.url,
      limit: limit,
      offset: offset,
      total: driverStandings.length,
      season: year,
      championshipId: `f1_${year}`,
      drivers_championship: formattedDriverStandings,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
