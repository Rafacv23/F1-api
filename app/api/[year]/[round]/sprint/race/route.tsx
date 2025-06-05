import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, convertToTimezone, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { eq, and, asc } from "drizzle-orm"
import {
  championships,
  circuits,
  drivers,
  races,
  sprintRace,
  teams,
} from "@/db/migrations/schema"

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
    const { searchParams } = new URL(request.url)
    const timezone = searchParams.get("timezone")
    const { year, round } = context.params

    const sprintRaceResults = await db
      .select()
      .from(sprintRace)
      .innerJoin(races, eq(races.raceId, sprintRace.raceId))
      .innerJoin(
        championships,
        eq(races.championshipId, championships.championshipId)
      )
      .innerJoin(drivers, eq(sprintRace.driverId, drivers.driverId))
      .innerJoin(teams, eq(sprintRace.teamId, teams.teamId))
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .where(
        and(eq(races.round, round), eq(races.championshipId, `f1_${year}`))
      )
      .limit(limit)
      .offset(offset)
      .orderBy(asc(sprintRace.finishingPosition))

    if (sprintRaceResults.length === 0) {
      return apiNotFound(
        request,
        "No sprint race results found for this round. Try with other one."
      )
    }

    const { date: localDate, time: localTime } = convertToTimezone(
      sprintRaceResults[0].Races.sprintRaceDate,
      sprintRaceResults[0].Races.sprintRaceTime,
      timezone
    )

    // Procesamos los datos
    const processedData = sprintRaceResults.map((row) => ({
      sprintRaceId: row.Sprint_Race.sprintRaceId,
      driverId: row.Sprint_Race.driverId,
      teamId: row.Sprint_Race.teamId,
      position: row.Sprint_Race.finishingPosition,
      gridPosition: row.Sprint_Race.gridPosition,
      points: row.Sprint_Race.pointsObtained,
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
    const circuitData = sprintRaceResults.map((row) => {
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
      timezone: timezone || undefined,
      total: sprintRaceResults.length,
      season: parseInt(year),
      races: {
        round: round,
        date: localDate,
        time: localTime,
        url: sprintRaceResults[0].Races.url,
        raceId: sprintRaceResults[0].Races.raceId,
        raceName: sprintRaceResults[0].Races.raceName,
        circuit: circuitData[0],
        sprintRaceResults: processedData,
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
