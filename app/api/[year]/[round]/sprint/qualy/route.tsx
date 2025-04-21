import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import {
  championships,
  circuits,
  drivers,
  races,
  sprintQualy,
  teams,
} from "@/db/migrations/schema"
import { eq, and, asc } from "drizzle-orm"

export const revalidate = 600

interface ApiResponse extends BaseApiResponse {
  season: number | string
  races: any
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const { year, round } = context.params

    const sprintQualyResults = await db
      .select()
      .from(sprintQualy)
      .innerJoin(races, eq(races.raceId, sprintQualy.raceId))
      .innerJoin(
        championships,
        eq(races.championshipId, championships.championshipId)
      )
      .innerJoin(drivers, eq(sprintQualy.driverId, drivers.driverId))
      .innerJoin(teams, eq(sprintQualy.teamId, teams.teamId))
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .where(
        and(eq(races.round, round), eq(races.championshipId, `f1_${year}`))
      )
      .limit(limit)
      .offset(offset)
      .orderBy(asc(sprintQualy.gridPosition))

    if (sprintQualyResults.length === 0) {
      return apiNotFound(
        request,
        "No sprint qualy results found for this round. Try with other one."
      )
    }

    // Procesamos los datos
    const processedData = sprintQualyResults.map((row) => ({
      sprintQualyId: row.Sprint_Qualy.sprintQualyId,
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
        teamNationality: row.Teams.teamNationality,
        firstAppeareance: row.Teams.firstAppeareance,
        constructorsChampionships: row.Teams.constructorsChampionships,
        driversChampionships: row.Teams.driversChampionships,
        url: row.Teams.url,
      },
    }))

    // Obtener el circuito correspondiente a la carrera
    const circuitData = sprintQualyResults.map((row) => {
      return {
        circuitId: row.Circuits.circuitId,
        circuitName: row.Circuits.circuitName,
        country: row.Circuits.country,
        city: row.Circuits.city,
        circuitLength: row.Circuits.circuitLength + "km",
        corners: row.Circuits.numberOfCorners,
        firstParticipationYear: row.Circuits.firstParticipationYear,
        lapRecord: row.Circuits.lapRecord,
        fastestLapDriverId: row.Circuits.fastestLapDriverId,
        fastestLapTeamId: row.Circuits.fastestLapTeamId,
        fastestLapYear: row.Circuits.fastestLapYear,
        url: row.Circuits.url,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      offset: offset,
      total: sprintQualyResults.length,
      season: year,
      races: {
        round: round,
        date: sprintQualyResults[0].Races.sprintQualyDate,
        time: sprintQualyResults[0].Races.sprintQualyTime,
        url: sprintQualyResults[0].Races.url,
        raceId: sprintQualyResults[0].Races.raceId,
        raceName: sprintQualyResults[0].Races.raceName,
        circuit: circuitData[0],
        sprintQualyResults: processedData,
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
