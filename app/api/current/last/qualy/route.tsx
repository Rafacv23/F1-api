import { NextResponse } from "next/server"
import { CURRENT_YEAR, SITE_URL } from "@/lib/constants"
import { apiNotFound, getDay, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import {
  circuits,
  classifications,
  drivers,
  races,
  teams,
} from "@/db/migrations/schema"
import { eq, and, desc, lte } from "drizzle-orm"

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

    // Obtener la última carrera basada en la fecha de clasificación
    const lastRace = await db
      .select()
      .from(races)
      .where(
        and(
          lte(races.qualyDate, today), // Clasificación ya sucedió
          eq(races.championshipId, `f1_${year}`) // Temporada actual
        )
      )
      .orderBy(desc(races.qualyDate)) // Ordenar por la fecha de clasificación descendente
      .limit(1) // Obtener solo la última carrera

    if (lastRace.length === 0) {
      return apiNotFound(
        request,
        "No qualifying results found for the current season."
      )
    }

    const race = lastRace[0]

    // Obtener los datos de clasificación para esa carrera
    const qualyData = await db
      .select()
      .from(classifications)
      .innerJoin(races, eq(races.raceId, classifications.raceId))
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .innerJoin(drivers, eq(classifications.driverId, drivers.driverId))
      .innerJoin(teams, eq(classifications.teamId, teams.teamId))
      .where(eq(races.raceId, race.raceId)) // Solo datos de la última carrera
      .limit(limit || 20)
      .offset(offset)
      .orderBy(desc(races.qualyDate))

    if (qualyData.length === 0) {
      return apiNotFound(
        request,
        "No qualifying results found for the last race."
      )
    }

    // Procesar los datos
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

    const circuitData = qualyData.map((circuit) => {
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
      total: qualyData.length,
      season: year,
      races: {
        round: race.round,
        qualyTime: race.qualyTime,
        qualyDate: race.qualyDate,
        url: race.url,
        raceId: race.raceId,
        raceName: race.raceName,
        circuit: circuitData[0],
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
