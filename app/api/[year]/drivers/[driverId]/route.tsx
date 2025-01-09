import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import {
  circuits,
  drivers,
  races,
  results,
  sprintRace,
  teams,
} from "@/db/migrations/schema"
import { eq, and, InferModel } from "drizzle-orm"

export const revalidate = 120

interface ApiResponse extends BaseApiResponse {
  season: string | number
  championshipId: string
  driver: InferModel<typeof drivers>
  team: InferModel<typeof teams>
  results: any
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const { year, driverId } = context.params

    const resultsData = await db
      .select()
      .from(results)
      .innerJoin(races, eq(results.raceId, races.raceId))
      .innerJoin(drivers, eq(results.driverId, drivers.driverId))
      .innerJoin(teams, eq(results.teamId, teams.teamId))
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .leftJoin(sprintRace, eq(results.raceId, sprintRace.raceId))
      .where(
        and(
          eq(races.championshipId, `f1_${year}`),
          eq(results.driverId, driverId)
        )
      )
      .limit(limit)
      .offset(offset)

    if (resultsData.length === 0) {
      return apiNotFound(
        request,
        "No results found for this driver and year, try with another one."
      )
    }

    const driver = resultsData.map((row) => {
      return {
        driverId: row.Drivers.driverId,
        name: row.Drivers.name,
        surname: row.Drivers.surname,
        nationality: row.Drivers.nationality,
        birthday: row.Drivers.birthday,
        number: row.Drivers.number,
        shortName: row.Drivers.shortName,
        url: row.Drivers.url,
      }
    })

    const team = resultsData.map((row) => {
      return {
        teamId: row.Teams.teamId,
        teamName: row.Teams.teamName,
        teamNationality: row.Teams.teamNationality,
        firstAppeareance: row.Teams.firstAppeareance,
        constructorsChampionships: row.Teams.constructorsChampionships,
        driversChampionships: row.Teams.driversChampionships,
        url: row.Teams.url,
      }
    })

    // Procesamos los datos
    const processedData = resultsData.map((row) => {
      return {
        race: {
          raceId: row.Races.raceId,
          name: row.Races.raceName,
          round: row.Races.round,
          date: row.Races.raceDate,
          circuit: {
            circuitId: row.Circuits.circuitId,
            name: row.Circuits.circuitName,
            country: row.Circuits.country,
            city: row.Circuits.city,
            length: row.Circuits.circuitLength,
            lapRecord: row.Circuits.lapRecord,
            firstParticipationYear: row.Circuits.firstParticipationYear,
            numberOfCorners: row.Circuits.numberOfCorners,
            fastestLapDriverId: row.Circuits.fastestLapDriverId,
            fastestLapTeamId: row.Circuits.fastestLapTeamId,
            fastestLapYear: row.Circuits.fastestLapYear,
          },
        },
        result: {
          finishingPosition: row.Results.finishingPosition,
          gridPosition: row.Results.gridPosition,
          raceTime: row.Results.raceTime,
          pointsObtained: row.Results.pointsObtained,
          retired: row.Results.retired,
        },
        sprintResult:
          row.Sprint_Race?.finishingPosition != null
            ? {
                finishingPosition: row.Sprint_Race.finishingPosition,
                gridPosition: row.Sprint_Race.gridPosition,
                raceTime: row.Sprint_Race.raceTime,
                pointsObtained: row.Sprint_Race.pointsObtained,
                retired: row.Sprint_Race.retired,
              }
            : null,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      offset: offset,
      total: processedData.length,
      season: year,
      championshipId: `f1_${year}`,
      driver: driver[0],
      team: team[0],
      results: processedData,
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
