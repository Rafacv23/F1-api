import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getDay, getLimitAndOffset, getYear } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { eq, and, desc, lte } from "drizzle-orm"
import { circuits, drivers, fp1, races, teams } from "@/db/migrations/schema"

export const revalidate = 60

interface ApiResponse extends BaseApiResponse {
  season: number | string
  races: any
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const year = getYear()
    const today = getDay()

    const fp1Data = await db
      .select()
      .from(fp1)
      .innerJoin(races, eq(races.raceId, fp1.raceId))
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .innerJoin(drivers, eq(fp1.driverId, drivers.driverId))
      .innerJoin(teams, eq(fp1.teamId, teams.teamId))
      .where(
        and(lte(races.raceDate, today), eq(races.championshipId, `f1_${year}`))
      )
      .limit(20)
      .offset(offset)
      .orderBy(desc(races.fp1Date))

    if (fp1Data.length === 0) {
      return apiNotFound(
        request,
        "No fp1 results found for this round. Try with other one."
      )
    }

    // Procesamos los datos
    const processedData = fp1Data.map((row) => ({
      fp1Id: row.FP1.fp1Id,
      driverId: row.FP1.driverId,
      teamId: row.FP1.teamId,
      time: row.FP1.time,
      driver: {
        driverId: row.FP1.driverId,
        name: row.Drivers.name,
        surname: row.Drivers.surname,
        nationality: row.Drivers.nationality,
        number: row.Drivers.number,
        shortName: row.Drivers.shortName,
        birthday: row.Drivers.birthday,
        url: row.Drivers.url,
      },
      team: {
        teamId: row.FP1.teamId,
        teamName: row.Teams.teamName,
        nationality: row.Teams.teamNationality,
        firstAppareance: row.Teams.firstAppeareance,
        constructorsChampionships: row.Teams.constructorsChampionships,
        driversChampionships: row.Teams.driversChampionships,
        url: row.Teams.url,
      },
    }))

    // Obtener el circuito correspondiente a la carrera
    const circuitData = fp1Data.map((row) => {
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
      total: fp1Data.length,
      season: year,
      races: {
        round: fp1Data[0].Races.round,
        fp1Date: fp1Data[0].Races.fp1Date,
        fp1Time: fp1Data[0].Races.fp1Time,
        url: fp1Data[0].Races.url,
        raceId: fp1Data[0].Races.raceId,
        raceName: fp1Data[0].Races.raceName,
        circuit: circuitData[0],
        fp1Results: processedData,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
