import { NextResponse } from "next/server"
import { CURRENT_YEAR, SITE_URL } from "@/lib/constants"
import {
  apiNotFound,
  convertToTimezone,
  getDay,
  getLimitAndOffset,
} from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { circuits, drivers, fp3, races, teams } from "@/db/migrations/schema"
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

    const raceData = await db
      .select()
      .from(races)
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .where(
        and(lte(races.fp3Date, today), eq(races.championshipId, `f1_${year}`))
      )
      .orderBy(desc(races.fp3Date), desc(races.round))
      .limit(1)

    if (raceData.length === 0) {
      return apiNotFound(
        request,
        "No fp3 results found for this round. Try with other one."
      )
    }

    const race = raceData[0]

    const fp3Data = await db
      .select()
      .from(fp3)
      .innerJoin(drivers, eq(fp3.driverId, drivers.driverId))
      .innerJoin(teams, eq(fp3.teamId, teams.teamId))
      .where(eq(fp3.raceId, race.Races.raceId))
      .limit(limit || 20)
      .offset(offset)
      .orderBy(fp3.time)

    if (fp3Data.length === 0) {
      return apiNotFound(
        request,
        "No fp3 results found for this round. Try with other one."
      )
    }

    const { date: localDate, time: localTime } = convertToTimezone(
      race.Races.fp3Date,
      race.Races.fp3Time,
      timezone
    )

    // Procesamos los datos
    const processedData = fp3Data.map((row) => ({
      fp3Id: row.FP3.fp3Id,
      driverId: row.FP3.driverId,
      teamId: row.FP3.teamId,
      time: row.FP3.time,
      driver: {
        driverId: row.FP3.driverId,
        name: row.Drivers.name,
        surname: row.Drivers.surname,
        nationality: row.Drivers.nationality,
        number: row.Drivers.number,
        shortName: row.Drivers.shortName,
        birthday: row.Drivers.birthday,
        url: row.Drivers.url,
      },
      team: {
        teamId: row.FP3.teamId,
        teamName: row.Teams.teamName,
        nationality: row.Teams.teamNationality,
        firstAppareance: row.Teams.firstAppeareance,
        constructorsChampionships: row.Teams.constructorsChampionships,
        driversChampionships: row.Teams.driversChampionships,
        url: row.Teams.url,
      },
    }))

    const circuitData = {
      circuitId: race.Circuits.circuitId,
      circuitName: race.Circuits.circuitName,
      country: race.Circuits.country,
      city: race.Circuits.city,
      circuitLength:
        race.Circuits.circuitLength !== null && race.Circuits.circuitLength !== undefined
          ? `${race.Circuits.circuitLength}km`
          : null,
      lapRecord: race.Circuits.lapRecord,
      firstParticipationYear: race.Circuits.firstParticipationYear,
      corners: race.Circuits.numberOfCorners,
      fastestLapDriverId: race.Circuits.fastestLapDriverId,
      fastestLapTeamId: race.Circuits.fastestLapTeamId,
      fastestLapYear: race.Circuits.fastestLapYear,
      url: race.Circuits.url,
    }

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      offset: offset,
      timezone: timezone || undefined,
      total: fp3Data.length,
      season: year,
      races: {
        round: race.Races.round,
        fp3Date: localDate,
        fp3Time: localTime,
        url: race.Races.url,
        raceId: race.Races.raceId,
        raceName: race.Races.raceName,
        circuit: circuitData,
        fp3Results: processedData,
      },
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=60",
      },
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
