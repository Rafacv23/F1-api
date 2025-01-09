import { NextResponse } from "next/server"
import { CURRENT_YEAR, SITE_URL } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { getDay } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import {
  championships,
  circuits,
  drivers,
  races,
  results,
  teams,
} from "@/db/migrations/schema"
import { eq, and, lte, desc } from "drizzle-orm"

export const revalidate = 120

interface ApiResponse extends BaseApiResponse {
  season: number | string
  races: any
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const year = CURRENT_YEAR
    const today = getDay()

    const raceData = await db
      .select()
      .from(races)
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .innerJoin(
        championships,
        eq(races.championshipId, championships.championshipId)
      )
      .where(and(eq(championships.year, year), lte(races.raceDate, today)))
      .orderBy(desc(races.round))
      .limit(1)

    if (raceData.length === 0) {
      return apiNotFound(
        request,
        "No race found for this round. Try with other one."
      )
    }

    const race = raceData[0]

    const resultsData = await db
      .select()
      .from(results)
      .innerJoin(drivers, eq(results.driverId, drivers.driverId))
      .innerJoin(teams, eq(results.teamId, teams.teamId))
      .where(eq(results.raceId, race.Races.raceId))
      .orderBy(results.finishingPosition)
      .limit(limit || 20)
      .offset(offset)

    if (resultsData.length === 0) {
      return apiNotFound(
        request,
        "No race results found for this round. Try with other one."
      )
    }

    // Procesamos los datos de los resultados
    const processedData = resultsData.map((result) => ({
      position: result.Results.finishingPosition,
      points: result.Results.pointsObtained,
      grid: result.Results.gridPosition,
      time: result.Results.raceTime,
      fastLap: result.Results.fastLap,
      retired: result.Results.retired,
      driver: {
        driverId: result.Results.driverId,
        number: result.Drivers.number,
        shortName: result.Drivers.shortName,
        url: result.Drivers.url,
        name: result.Drivers.name,
        surname: result.Drivers.surname,
        nationality: result.Drivers.nationality,
        birthday: result.Drivers.birthday,
      },
      team: {
        teamId: result.Results.teamId,
        teamName: result.Teams.teamName,
        nationality: result.Teams.teamNationality,
        firstAppareance: result.Teams.firstAppeareance,
        constructorsChampionships: result.Teams.constructorsChampionships,
        driversChampionships: result.Teams.driversChampionships,
        url: result.Teams.url,
      },
    }))

    // Obtener el circuito correspondiente a la carrera
    const circuitData = raceData.map((circuit) => {
      return {
        circuitId: circuit.Circuits.circuitId,
        circuitName: circuit.Circuits.circuitName,
        country: circuit.Circuits.country,
        city: circuit.Circuits.city,
        circuitLength: circuit.Circuits.circuitLength + "km",
        corners: circuit.Circuits.numberOfCorners,
        firstParticipationYear: circuit.Circuits.firstParticipationYear,
        lapRecord: circuit.Circuits.lapRecord,
        fastestLapDriverId: circuit.Circuits.fastestLapDriverId,
        fastestLapTeamId: circuit.Circuits.fastestLapTeamId,
        fastestLapYear: circuit.Circuits.fastestLapYear,
        url: circuit.Circuits.url,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      offset: offset,
      total: resultsData.length,
      season: year,
      races: {
        round: race.Races.round,
        date: race.Races.raceDate,
        time: race.Races.raceTime,
        url: race.Races.url,
        raceId: race.Races.raceId,
        raceName: race.Races.raceName,
        circuit: circuitData[0],
        results: processedData,
      },
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
