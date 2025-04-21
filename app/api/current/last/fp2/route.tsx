import { NextResponse } from "next/server"
import { CURRENT_YEAR, SITE_URL } from "@/lib/constants"
import { apiNotFound, getDay, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { eq, and, desc, lte } from "drizzle-orm"
import { circuits, drivers, fp2, races, teams } from "@/db/migrations/schema"

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

    const fp2Data = await db
      .select()
      .from(fp2)
      .innerJoin(races, eq(races.raceId, fp2.raceId))
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .innerJoin(drivers, eq(fp2.driverId, drivers.driverId))
      .innerJoin(teams, eq(fp2.teamId, teams.teamId))
      .where(
        and(lte(races.raceDate, today), eq(races.championshipId, `f1_${year}`))
      )
      .limit(limit || 20)
      .offset(offset)
      .orderBy(desc(races.fp2Date))

    if (fp2Data.length === 0) {
      return apiNotFound(
        request,
        "No fp2 results found for this round. Try with other one."
      )
    }

    // Procesamos los datos
    const processedData = fp2Data.map((row) => ({
      fp2Id: row.FP2.fp2Id,
      driverId: row.FP2.driverId,
      teamId: row.FP2.teamId,
      time: row.FP2.time,
      driver: {
        driverId: row.FP2.driverId,
        name: row.Drivers.name,
        surname: row.Drivers.surname,
        nationality: row.Drivers.nationality,
        number: row.Drivers.number,
        shortName: row.Drivers.shortName,
        birthday: row.Drivers.birthday,
        url: row.Drivers.url,
      },
      team: {
        teamId: row.FP2.teamId,
        teamName: row.Teams.teamName,
        nationality: row.Teams.teamNationality,
        firstAppareance: row.Teams.firstAppeareance,
        constructorsChampionships: row.Teams.constructorsChampionships,
        driversChampionships: row.Teams.driversChampionships,
        url: row.Teams.url,
      },
    }))

    // Obtener el circuito correspondiente a la carrera
    const circuitData = fp2Data.map((row) => {
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
      total: fp2Data.length,
      season: year,
      races: {
        round: fp2Data[0].Races.round,
        fp2Date: fp2Data[0].Races.fp1Date,
        fp2Time: fp2Data[0].Races.fp1Time,
        url: fp2Data[0].Races.url,
        raceId: fp2Data[0].Races.raceId,
        raceName: fp2Data[0].Races.raceName,
        circuit: circuitData[0],
        fp2Results: processedData,
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
