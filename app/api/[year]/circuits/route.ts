import { NextResponse } from "next/server"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { SITE_NAME } from "@/lib/constants"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { circuits, races } from "@/db/migrations/schema"
import { eq } from "drizzle-orm"

export const revalidate = 120

type Circuit = {
  circuitId: string | null
  circuitName: string | null
  country: string | null
  city: string | null
  circuitLength: number | null
  firstParticipationYear: number | null
  corners?: number | null
  lapRecord: string | null
  fastestLapDriverId: string | null
  fastestLapTeamId: string | null
  fastestLapYear: number | null
  url: string | null
}

interface ApiResponse extends BaseApiResponse {
  season: string | number
  circuits: Circuit[]
}

export async function GET(request: Request, context: any) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const { year } = context.params

    const circuitsData = await db
      .select({
        circuitId: races.circuit,
        circuitName: circuits.circuitName,
        country: circuits.country,
        city: circuits.city,
        circuitLength: circuits.circuitLength,
        lapRecord: circuits.lapRecord,
        firstParticipationYear: circuits.firstParticipationYear,
        numberOfCorners: circuits.numberOfCorners,
        fastestLapDriverId: circuits.fastestLapDriverId,
        fastestLapTeamId: circuits.fastestLapTeamId,
        fastestLapYear: circuits.fastestLapYear,
        url: circuits.url,
      })
      .from(circuits)
      .innerJoin(races, eq(circuits.circuitId, races.circuit))
      .where(eq(races.championshipId, `f1_${year}`))
      .limit(limit)
      .offset(offset)

    if (circuitsData.length === 0) {
      return apiNotFound(
        request,
        "No circuits found for this year. Try with other one."
      )
    }

    circuitsData.forEach((circuit) => {
      return {
        circuitId: circuit.circuitId,
        circuitName: circuit.circuitName,
        country: circuit.country,
        city: circuit.city,
        circuitLength: circuit.circuitLength,
        lapRecord: circuit.lapRecord,
        firstParticipationYear: circuit.firstParticipationYear,
        corners: circuit.numberOfCorners,
        fastestLapDriverId: circuit.fastestLapDriverId,
        fastestLapTeamId: circuit.fastestLapTeamId,
        fastestLapYear: circuit.fastestLapYear,
        url: circuit.url,
      }
    })

    const response: ApiResponse = {
      api: SITE_NAME,
      url: request.url,
      limit: limit,
      offset: offset,
      total: circuitsData.length,
      season: year,
      circuits: circuitsData,
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
