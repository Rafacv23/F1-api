import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { circuits } from "@/db/migrations/schema"
import { InferModel } from "drizzle-orm"

export const revalidate = 60

type Circuit = InferModel<typeof circuits>

interface ApiResponse extends BaseApiResponse {
  circuits: Circuit[]
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams

  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const circuitsData = await db
      .select()
      .from(circuits)
      .limit(limit)
      .offset(offset)

    if (circuitsData.length === 0) {
      return apiNotFound(request, "No circuits found.")
    }

    circuitsData.forEach((circuit) => {
      return {
        circuitId: circuit.circuitId,
        circuitName: circuit.circuitName,
        country: circuit.country,
        city: circuit.city,
        circuitLength: circuit.circuitLength,
        corners: circuit.numberOfCorners,
        firstParticipationYear: circuit.firstParticipationYear,
        lapRecord: circuit.lapRecord,
        fastestLapDriverId: circuit.fastestLapDriverId,
        fastestLapTeamId: circuit.fastestLapTeamId,
        fastestLapYear: circuit.fastestLapYear,
        url: circuit.url,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      offset: offset,
      total: circuitsData.length,
      circuits: circuitsData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
