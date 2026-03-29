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
import { eq, and, desc, lte } from "drizzle-orm"
import { circuits, drivers, fp2, races, teams } from "@/db/migrations/schema"

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
        and(lte(races.fp2Date, today), eq(races.championshipId, `f1_${year}`))
      )
      .orderBy(desc(races.fp2Date), desc(races.round))
      .limit(1)

    if (raceData.length === 0) {
      return apiNotFound(
        request,
        "No fp2 results found for this round. Try with other one."
      )
    }

    const race = raceData[0]

    const fp2Data = await db
      .select()
      .from(fp2)
      .innerJoin(drivers, eq(fp2.driverId, drivers.driverId))
      .innerJoin(teams, eq(fp2.teamId, teams.teamId))
      .where(eq(fp2.raceId, race.Races.raceId))
      .limit(limit || 20)
      .offset(offset)
      .orderBy(fp2.time)

    if (fp2Data.length === 0) {
      return apiNotFound(
        request,
        "No fp2 results found for this round. Try with other one."
      )
    }

    const { date: localDate, time: localTime } = convertToTimezone(
      race.Races.fp2Date,
      race.Races.fp2Time,
      timezone
    )

    // Procesamos los datos
    const processedData = fp2Data.map((row) => ({
      fp2Id: row.FP2.fp2Id,
      driverId: row.FP2.driverId,
      teamId: row.FP2.teamId,
      time: row.FP2.time,
      driver: {
        driverId: row.FP2.driverId,
        name: row.Drivers.name,
        surname: row.Drivers.surname,
        nationality: row.Drivers.nationality,
        number: row.Drivers.number,
        shortName: row.Drivers.shortName,
        birthday: row.Drivers.birthday,
        url: row.Drivers.url,
      },
      team: {
        teamId: row.FP2.teamId,
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
      total: fp2Data.length,
      season: year,
      races: {
        round: race.Races.round,
        fp2Date: localDate,
        fp2Time: localTime,
        url: race.Races.url,
        raceId: race.Races.raceId,
        raceName: race.Races.raceName,
        circuit: circuitData,
        fp2Results: processedData,
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
