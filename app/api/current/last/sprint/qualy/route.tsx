import { NextResponse } from "next/server"
import { CURRENT_YEAR, SITE_URL } from "@/lib/constants"
import { apiNotFound, getDay, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import {
  circuits,
  drivers,
  races,
  sprintQualy,
  teams,
} from "@/db/migrations/schema"
import { and, desc, eq, lte } from "drizzle-orm"

export const revalidate = 600

interface ApiResponse extends BaseApiResponse {
  season: number | string
  timezone?: string
  races: any
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)

  try {
    const { searchParams } = new URL(request.url)
    const timezone = searchParams.get("timezone")

    const year = CURRENT_YEAR
    const today = getDay()

    const lastSprintQualy = await db
      .select()
      .from(races)
      .where(
        and(
          eq(races.championshipId, `f1_${year}`),
          lte(races.sprintQualyDate, today),
        ),
      )
      .orderBy(desc(races.sprintQualyDate), desc(races.round))
      .limit(1)

    if (lastSprintQualy.length === 0) {
      return apiNotFound(
        request,
        "No sprint qualifying results found for this season yet.",
      )
    }

    const race = lastSprintQualy[0]

    const sprintQualyData = await db
      .select()
      .from(sprintQualy)
      .innerJoin(drivers, eq(sprintQualy.driverId, drivers.driverId))
      .innerJoin(teams, eq(sprintQualy.teamId, teams.teamId))
      .innerJoin(races, eq(sprintQualy.raceId, races.raceId))
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .where(eq(sprintQualy.raceId, race.raceId))
      .orderBy(sprintQualy.gridPosition)
      .limit(limit)
      .offset(offset)

    if (sprintQualyData.length === 0) {
      return apiNotFound(
        request,
        "No sprint qualy results found for this round. Try with other one.",
      )
    }

    const processedData = sprintQualyData.map((row) => ({
      sprintQualyId: row.Sprint_Qualy.sprintQualyId,
      raceId: row.Sprint_Qualy.raceId,
      driverId: row.Sprint_Qualy.driverId,
      teamId: row.Sprint_Qualy.teamId,
      sq1: row.Sprint_Qualy.sq1,
      sq2: row.Sprint_Qualy.sq2,
      sq3: row.Sprint_Qualy.sq3,
      gridPosition: row.Sprint_Qualy.gridPosition,
      driver: {
        driverId: row.Drivers.driverId,
        number: row.Drivers.number,
        name: row.Drivers.name,
        surname: row.Drivers.surname,
        shortName: row.Drivers.shortName,
        url: row.Drivers.url,
        nationality: row.Drivers.nationality,
        birthday: row.Drivers.birthday,
      },
      team: {
        teamId: row.Teams.teamId,
        teamName: row.Teams.teamName,
        nationality: row.Teams.teamNationality,
        firstAppareance: row.Teams.firstAppeareance,
        constructorsChampionships: row.Teams.constructorsChampionships,
        driversChampionships: row.Teams.driversChampionships,
        url: row.Teams.url,
      },
    }))

    const circuitData = {
      circuitId: sprintQualyData[0].Circuits.circuitId,
      circuitName: sprintQualyData[0].Circuits.circuitName,
      country: sprintQualyData[0].Circuits.country,
      city: sprintQualyData[0].Circuits.city,
      circuitLength:
        sprintQualyData[0].Circuits.circuitLength !== null &&
        sprintQualyData[0].Circuits.circuitLength !== undefined
          ? `${sprintQualyData[0].Circuits.circuitLength}km`
          : null,
      lapRecord: sprintQualyData[0].Circuits.lapRecord,
      firstParticipationYear:
        sprintQualyData[0].Circuits.firstParticipationYear,
      corners: sprintQualyData[0].Circuits.numberOfCorners,
      fastestLapDriverId: sprintQualyData[0].Circuits.fastestLapDriverId,
      fastestLapTeamId: sprintQualyData[0].Circuits.fastestLapTeamId,
      fastestLapYear: sprintQualyData[0].Circuits.fastestLapYear,
      url: sprintQualyData[0].Circuits.url,
    }

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit,
      offset,
      total: processedData.length,
      season: year,
      races: {
        date: race.sprintQualyDate,
        time: race.sprintQualyTime,
        raceId: race.raceId,
        raceName: race.raceName,
        round: race.round,
        url: race.url,
        circuit: circuitData,
        sprintQualyResults: processedData,
      },
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control":
          "public, s-maxage=120, max-age=30, stale-while-revalidate=600, stale-if-error=86400",
      },
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
