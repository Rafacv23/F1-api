import { db } from "@/db"
import {
  championships,
  circuits,
  drivers,
  races,
  teams,
} from "@/db/migrations/schema"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, convertToTimezone, getLimitAndOffset } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const revalidate = 600

export async function GET(request: Request, context: any) {
  try {
    const { year } = context.params
    const queryParams = new URL(request.url).searchParams
    const { limit, offset } = getLimitAndOffset(queryParams)
    const { searchParams } = new URL(request.url)
    const timezone = searchParams.get("timezone")

    const championshipData = await db
      .select()
      .from(championships)
      .where(eq(championships.year, year))
      .limit(1)

    if (championshipData.length === 0) {
      return apiNotFound(
        request,
        "No seasons found for this year, try with another one."
      )
    }

    const championship = championshipData[0]

    const seasonData = await db
      .select()
      .from(races)
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .leftJoin(drivers, eq(races.winnerId, drivers.driverId))
      .leftJoin(teams, eq(races.teamWinnerId, teams.teamId))
      .where(eq(races.championshipId, championship.championshipId))
      .limit(limit)
      .offset(offset)
      .orderBy(races.round, races.raceId)

    if (seasonData.length === 0) {
      return apiNotFound(
        request,
        "No races found for this season, try with another one."
      )
    }

    // Formatear los datos
    const formattedData = seasonData.map((race) => ({
      raceId: race.Races.raceId,
      championshipId: race.Races.championshipId,
      raceName: race.Races.raceName,
      schedule: {
        race: convertToTimezone(
          race.Races.raceDate,
          race.Races.raceTime,
          timezone
        ),
        qualy: convertToTimezone(
          race.Races.qualyDate,
          race.Races.qualyTime,
          timezone
        ),
        fp1: convertToTimezone(
          race.Races.fp1Date,
          race.Races.fp1Time,
          timezone
        ),
        fp2: convertToTimezone(
          race.Races.fp2Date,
          race.Races.fp2Time,
          timezone
        ),
        fp3: convertToTimezone(
          race.Races.fp3Date,
          race.Races.fp3Time,
          timezone
        ),
        sprintQualy: convertToTimezone(
          race.Races.sprintQualyDate,
          race.Races.sprintQualyTime,
          timezone
        ),
        sprintRace: convertToTimezone(
          race.Races.sprintRaceDate,
          race.Races.sprintRaceTime,
          timezone
        ),
      },
      laps: race.Races.laps,
      round: race.Races.round,
      url: race.Races.url,
      fast_lap: {
        fast_lap: race.Races.fastLap,
        fast_lap_driver_id: race.Races.fastLapDriverId,
        fast_lap_team_id: race.Races.fastLapTeamId,
      },
      circuit: {
        circuitId: race.Circuits.circuitId,
        circuitName: race.Circuits.circuitName,
        country: race.Circuits.country,
        city: race.Circuits.city,
        circuitLength: race.Circuits.circuitLength + "km",
        lapRecord: race.Circuits.lapRecord,
        firstParticipationYear: race.Circuits.firstParticipationYear,
        corners: race.Circuits.numberOfCorners,
        fastestLapDriverId: race.Circuits.fastestLapDriverId,
        fastestLapTeamId: race.Circuits.fastestLapTeamId,
        fastestLapYear: race.Circuits.fastestLapYear,
        url: race.Circuits.url,
      },
      winner: race.Drivers?.driverId
        ? {
            driverId: race.Drivers.driverId,
            name: race.Drivers.name,
            surname: race.Drivers.surname,
            country: race.Drivers.nationality,
            birthday: race.Drivers.birthday,
            number: race.Drivers.number,
            shortName: race.Drivers.shortName,
            url: race.Drivers.url,
          }
        : null,
      teamWinner: race.Teams?.teamId
        ? {
            teamId: race.Teams.teamId,
            teamName: race.Teams.teamName,
            country: race.Teams.teamNationality,
            firstAppearance: race.Teams.firstAppeareance,
            constructorsChampionships: race.Teams.constructorsChampionships,
            driversChampionships: race.Teams.driversChampionships,
            url: race.Teams.url,
          }
        : null,
    }))

    const response = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      offset: offset,
      timezone: timezone || undefined,
      total: formattedData.length,
      season: parseInt(year),
      championship: championship,
      races: formattedData,
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=30",
      },
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
