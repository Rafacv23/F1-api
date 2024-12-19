import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getYear, getDay } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import {
  championships,
  circuits,
  drivers,
  races,
  teams,
} from "@/db/migrations/schema"
import { eq, and, gte, asc } from "drizzle-orm"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: number | string
  round?: number | null
  championship: any
  race: any
}

export async function GET(request: Request) {
  try {
    const year = getYear()
    const today = getDay()
    //   const sql = `SELECT Races.*, Circuits.*
    // FROM Races
    // JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    // JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
    // WHERE Championships.Year = ? AND Races.Race_Date >= ?
    // ORDER BY RACES.Round ASC
    // LIMIT ?;
    // `
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
      .where(
        and(
          eq(races.championshipId, championship.championshipId),
          gte(races.raceDate, today)
        )
      )
      .limit(1)
      .orderBy(asc(races.round))

    if (seasonData.length === 0) {
      return apiNotFound(
        request,
        "No races found for this season, try with another one."
      )
    }

    const formattedData = seasonData.map((race) => ({
      raceId: race.Races.raceId,
      championshipId: race.Races.championshipId,
      raceName: race.Races.raceName,
      schedule: {
        race: { date: race.Races.raceDate, time: race.Races.raceTime },
        qualy: { date: race.Races.qualyDate, time: race.Races.qualyTime },
        fp1: { date: race.Races.fp1Date, time: race.Races.fp1Time },
        fp2: { date: race.Races.fp2Date, time: race.Races.fp2Time },
        fp3: { date: race.Races.fp3Date, time: race.Races.fp3Time },
        sprintQualy: {
          date: race.Races.sprintQualyDate,
          time: race.Races.sprintQualyTime,
        },
        sprintRace: {
          date: race.Races.sprintRaceDate,
          time: race.Races.sprintRaceTime,
        },
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

    const response: ApiResponse = {
      api: SITE_URL,
      url: `${SITE_URL}api/current/last`,
      total: formattedData.length,
      season: year,
      round: formattedData[0].round,
      championship: championship,
      race: formattedData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
