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
import { circuits, drivers, fp3, races, teams } from "@/db/migrations/schema"
import { and, desc, eq, lte } from "drizzle-orm"

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

    const fp3Data = await db
      .select()
      .from(fp3)
      .innerJoin(races, eq(races.raceId, fp3.raceId))
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .innerJoin(drivers, eq(fp3.driverId, drivers.driverId))
      .innerJoin(teams, eq(fp3.teamId, teams.teamId))
      .where(
        and(lte(races.raceDate, today), eq(races.championshipId, `f1_${year}`))
      )
      .limit(limit || 20)
      .offset(offset)
      .orderBy(desc(races.fp3Date))

    if (fp3Data.length === 0) {
      return apiNotFound(
        request,
        "No fp3 results found for this round. Try with other one."
      )
    }

    const { date: localDate, time: localTime } = convertToTimezone(
      fp3Data[0].Races.fp3Date,
      fp3Data[0].Races.fp3Time,
      timezone
    )

    // Procesamos los datos
    const processedData = fp3Data.map((row) => ({
      fp3Id: row.FP3.fp3Id,
      driverId: row.FP3.driverId,
      teamId: row.FP3.teamId,
      time: row.FP3.time,
      driver: {
        driverId: row.FP3.driverId,
        name: row.Drivers.name,
        surname: row.Drivers.surname,
        nationality: row.Drivers.nationality,
        number: row.Drivers.number,
        shortName: row.Drivers.shortName,
        birthday: row.Drivers.birthday,
        url: row.Drivers.url,
      },
      team: {
        teamId: row.FP3.teamId,
        teamName: row.Teams.teamName,
        nationality: row.Teams.teamNationality,
        firstAppareance: row.Teams.firstAppeareance,
        constructorsChampionships: row.Teams.constructorsChampionships,
        driversChampionships: row.Teams.driversChampionships,
        url: row.Teams.url,
      },
    }))

    // Obtener el circuito correspondiente a la carrera
    const circuitData = fp3Data.map((row) => {
      return {
        circuitId: row.Circuits.circuitId,
        circuitName: row.Circuits.circuitName,
        country: row.Circuits.country,
        city: row.Circuits.city,
        circuitLength: row.Circuits.circuitLength + "km",
        lapRecord: row.Circuits.lapRecord,
        firstParticipationYear: row.Circuits.firstParticipationYear,
        corners: row.Circuits.numberOfCorners,
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
      total: fp3Data.length,
      season: year,
      races: {
        round: fp3Data[0].Races.round,
        fp3Date: localDate,
        fp3Time: localTime,
        url: fp3Data[0].Races.url,
        raceId: fp3Data[0].Races.raceId,
        raceName: fp3Data[0].Races.raceName,
        circuit: circuitData[0],
        fp3Results: processedData,
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
