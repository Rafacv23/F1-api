import { NextResponse } from "next/server"
import { CURRENT_YEAR, SITE_URL } from "@/lib/constants"
import { apiNotFound, getDay, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import {
  circuits,
  drivers,
  races,
  sprintRace,
  teams,
} from "@/db/migrations/schema"
import { and, desc, eq, lte } from "drizzle-orm"

export const revalidate = 600

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

    const lastSprintRace = await db
      .select()
      .from(races)
      .where(
        and(
          eq(races.championshipId, `f1_${year}`),
          lte(races.sprintRaceDate, today),
        ),
      )
      .orderBy(desc(races.sprintRaceDate), desc(races.round))
      .limit(1)

    if (lastSprintRace.length === 0) {
      return apiNotFound(
        request,
        "No sprint race results found for this season yet.",
      )
    }

    const race = lastSprintRace[0]

    const sprintRaceData = await db
      .select()
      .from(sprintRace)
      .innerJoin(drivers, eq(sprintRace.driverId, drivers.driverId))
      .innerJoin(teams, eq(sprintRace.teamId, teams.teamId))
      .innerJoin(races, eq(sprintRace.raceId, races.raceId))
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .where(eq(sprintRace.raceId, race.raceId))
      .orderBy(sprintRace.finishingPosition)
      .limit(limit)
      .offset(offset)

    if (sprintRaceData.length === 0) {
      return apiNotFound(
        request,
        "No sprint race results found for this round. Try with other one.",
      )
    }

    const processedData = sprintRaceData.map((row) => ({
      sprintRaceId: row.Sprint_Race.sprintRaceId,
      position: row.Sprint_Race.finishingPosition,
      points: row.Sprint_Race.pointsObtained,
      grid: row.Sprint_Race.gridPosition,
      laps: row.Sprint_Race.laps,
      time: row.Sprint_Race.raceTime,
      retired: row.Sprint_Race.retired,
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
      circuitId: sprintRaceData[0].Circuits.circuitId,
      circuitName: sprintRaceData[0].Circuits.circuitName,
      country: sprintRaceData[0].Circuits.country,
      city: sprintRaceData[0].Circuits.city,
      circuitLength:
        sprintRaceData[0].Circuits.circuitLength !== null &&
        sprintRaceData[0].Circuits.circuitLength !== undefined
          ? `${sprintRaceData[0].Circuits.circuitLength}km`
          : null,
      lapRecord: sprintRaceData[0].Circuits.lapRecord,
      firstParticipationYear: sprintRaceData[0].Circuits.firstParticipationYear,
      corners: sprintRaceData[0].Circuits.numberOfCorners,
      fastestLapDriverId: sprintRaceData[0].Circuits.fastestLapDriverId,
      fastestLapTeamId: sprintRaceData[0].Circuits.fastestLapTeamId,
      fastestLapYear: sprintRaceData[0].Circuits.fastestLapYear,
      url: sprintRaceData[0].Circuits.url,
    }

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit,
      offset,
      total: processedData.length,
      season: year,
      races: {
        date: race.sprintRaceDate,
        time: race.sprintRaceTime,
        raceId: race.raceId,
        raceName: race.raceName,
        round: race.round,
        url: race.url,
        circuit: circuitData,
        sprintRaceResults: processedData,
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
