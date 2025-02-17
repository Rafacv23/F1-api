import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import {
  constructorsClassifications,
  driverClassifications,
  drivers,
  teams,
} from "@/db/migrations/schema"
import { and, eq, InferModel } from "drizzle-orm"

export const revalidate = 120

interface ApiResponse extends BaseApiResponse {
  season: number | string
  teamId: string
  team: InferModel<typeof teams>
  drivers: {
    driver: {
      driverId: string
      name: string
      surname: string
      nationality: string
      birthday: string
      number: number | null
      shortName: string | null
      url: string | null
    }
  }[]
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const { year, teamId } = context.params // Captura los parámetros year y driverId de la URL

    // const data = await db
    //   .select({
    //     drivers,
    //     teams,
    //   })
    //   .from(results)
    //   .innerJoin(races, eq(results.raceId, races.raceId))
    //   .innerJoin(
    //     championships,
    //     eq(races.championshipId, championships.championshipId)
    //   )
    //   .innerJoin(teams, eq(results.teamId, teams.teamId))
    //   .innerJoin(drivers, eq(results.driverId, drivers.driverId))
    //   .where(and(eq(results.teamId, teamId), eq(championships.year, year)))
    //   .groupBy(drivers.driverId)
    //   .orderBy(drivers.name)
    //   .limit(limit || 4)
    //   .offset(offset || 0)

    const data = await db
      .select({
        drivers,
        teams,
        driverClassifications,
        constructorsClassifications,
      })
      .from(driverClassifications)
      .innerJoin(teams, eq(driverClassifications.teamId, teams.teamId))
      .innerJoin(drivers, eq(driverClassifications.driverId, drivers.driverId))
      .innerJoin(
        constructorsClassifications,
        and(
          eq(constructorsClassifications.teamId, teamId),
          eq(constructorsClassifications.championshipId, `f1_${year}`)
        )
      )
      .where(
        and(
          eq(driverClassifications.teamId, teamId),
          eq(driverClassifications.championshipId, `f1_${year}`)
        )
      )
      .groupBy(driverClassifications.driverId)
      .orderBy(driverClassifications.points)
      .limit(limit || 4)
      .offset(offset || 0)

    if (data.length === 0) {
      return apiNotFound(
        request,
        "No team or drivers found for this year and team ID."
      )
    }

    // Procesamos los datos
    const processedData = data.map((driver) => {
      return {
        driver: {
          driverId: driver.drivers.driverId,
          name: driver.drivers.name,
          surname: driver.drivers.surname,
          nationality: driver.drivers.nationality,
          birthday: driver.drivers.birthday,
          number: driver.drivers.number,
          shortName: driver.drivers.shortName,
          url: driver.drivers.url,
          points: driver.driverClassifications.points,
          position: driver.driverClassifications.position,
          wins: driver.driverClassifications.wins,
        },
      }
    })

    const teamData = data.map((row) => {
      return {
        teamId: row.teams.teamId,
        teamName: row.teams.teamName,
        teamNationality: row.teams.teamNationality,
        firstAppeareance: row.teams.firstAppeareance,
        constructorsChampionships: row.teams.constructorsChampionships,
        driversChampionships: row.teams.driversChampionships,
        points: row.constructorsClassifications.points,
        position: row.constructorsClassifications.position,
        wins: row.constructorsClassifications.wins,
        url: row.teams.url,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      total: processedData.length,
      limit: limit,
      offset: offset,
      season: year,
      teamId: teamId,
      team: teamData[0],
      drivers: processedData,
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
