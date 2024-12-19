import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getDay, getLimitAndOffset, getYear } from "@/lib/utils"
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
    const qualyData = await db
      .select()
      .from(classifications)
      .innerJoin(races, eq(races.raceId, classifications.raceId))
      .innerJoin(circuits, eq(races.circuit, circuits.circuitId))
      .innerJoin(drivers, eq(classifications.driverId, drivers.driverId))
      .innerJoin(teams, eq(classifications.teamId, teams.teamId))
      .where(
        and(lte(races.qualyDate, today), eq(races.championshipId, `f1_${year}`))
      )
      .limit(20)
      .offset(offset)
      .orderBy(desc(races.qualyDate))

    if (qualyData.length === 0) {
      return apiNotFound(
        request,
        "No qualy results found for this round. Try with other one."
      )
    }

    // Procesamos los datos
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

    // Obtener el circuito correspondiente a la carrera
    const circuitData = qualyData.map((row) => {
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
      total: qualyData.length,
      season: year,
      races: {
        round: qualyData[0].Races.round,
        qualyTime: qualyData[0].Races.qualyTime,
        qualyDate: qualyData[0].Races.qualyDate,
        url: qualyData[0].Races.url,
        raceId: qualyData[0].Races.raceId,
        raceName: qualyData[0].Races.raceName,
        circuit: circuitData[0],
        qualyResults: processedData,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
