import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { eq, InferModel } from "drizzle-orm"
import { circuits } from "@/db/migrations/schema"

export const revalidate = 60

type Circuit = InferModel<typeof circuits>

interface ApiResponse extends BaseApiResponse {
  circuit: Circuit[]
}

export async function GET(request: Request, context: any) {
  try {
    const { circuitId } = context.params
    const limit = 1

    const circuitData = await db
      .select()
      .from(circuits)
      .where(eq(circuits.circuitId, circuitId))
      .limit(limit)

    if (circuitData.length === 0) {
      return apiNotFound(
        request,
        "No Circuit found for this id, try with other one."
      )
    }

    circuitData.forEach((circuit) => {
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
      total: circuitData.length,
      circuit: circuitData,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
