import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, convertToTimezone, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import {
  circuits,
  classifications,
  drivers,
  races,
  teams,
} from "@/db/migrations/schema"
import { eq, and, asc } from "drizzle-orm"

export const revalidate = 600

interface ApiResponse extends BaseApiResponse {
  season: number | string
  timezone?: string
  races: any
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const { year, round } = context.params
    const roundNumber = Number(round)
    const { searchParams } = new URL(request.url)
    const timezone = searchParams.get("timezone")

    if (!Number.isInteger(roundNumber)) {
      return apiNotFound(
        request,
        "No qualy results found for this round. Try with other one."
      )
    }

    const raceData = await db
      .select()
      .from(races)
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .where(and(eq(races.round, roundNumber), eq(races.championshipId, `f1_${year}`)))
      .limit(1)

    if (raceData.length === 0) {
      return apiNotFound(
        request,
        "No qualy results found for this round. Try with other one."
      )
    }

    const race = raceData[0]

    const qualyData = await db
      .select()
      .from(classifications)
      .innerJoin(drivers, eq(classifications.driverId, drivers.driverId))
      .innerJoin(teams, eq(classifications.teamId, teams.teamId))
      .where(eq(classifications.raceId, race.Races.raceId))
      .limit(limit)
      .offset(offset)
      .orderBy(asc(classifications.gridPosition))

    if (qualyData.length === 0) {
      return apiNotFound(
        request,
        "No qualy results found for this round. Try with other one."
      )
    }

    const { date: localDate, time: localTime } = convertToTimezone(
      race.Races.qualyDate,
      race.Races.qualyTime,
      timezone
    )

    // Procesamos los datos
    const processedData = qualyData.map((row) => ({
      classificationId: row.Classifications.classificationId,
      driverId: row.Classifications.driverId,
      teamId: row.Classifications.teamId,
      q1: row.Classifications.q1,
      q2: row.Classifications.q2,
      q3: row.Classifications.q3,
      gridPosition: row.Classifications.gridPosition,
      driver: {
        driverId: row.Drivers.driverId,
        number: row.Drivers.number,
        shortName: row.Drivers.shortName,
        url: row.Drivers.url,
        name: row.Drivers.name,
        surname: row.Drivers.surname,
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
      total: qualyData.length,
      season: parseInt(year),
      races: {
        round: round,
        qualyTime: localTime,
        qualyDate: localDate,
        url: race.Races.url,
        raceId: race.Races.raceId,
        raceName: race.Races.raceName,
        circuit: circuitData,
        qualyResults: processedData,
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
