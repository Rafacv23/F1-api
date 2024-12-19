import { NextResponse } from "next/server"
import { apiNotFound, getYear, getLimitAndOffset } from "@/lib/utils"
import { SITE_URL } from "@/lib/constants"
import { BaseApiResponse } from "@/lib/definitions"
import { InferModel, eq, asc } from "drizzle-orm"
import { driverClassifications, drivers } from "@/db/migrations/schema"
import { db } from "@/db"

export const revalidate = 60

type Driver = InferModel<typeof drivers>
type ExtendedDriver = Driver & { teamId: string | null }

interface ApiResponse extends BaseApiResponse {
  season: string | number
  championshipId: string
  drivers: ExtendedDriver[]
}
export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const year = getYear()

    const driversData = await db
      .select({
        driverId: drivers.driverId,
        name: drivers.name,
        surname: drivers.surname,
        nationality: drivers.nationality,
        birthday: drivers.birthday,
        number: drivers.number,
        shortName: drivers.shortName,
        url: drivers.url,
        teamId: driverClassifications.teamId,
      })
      .from(drivers)
      .innerJoin(
        driverClassifications,
        eq(drivers.driverId, driverClassifications.driverId)
      )
      .where(eq(driverClassifications.championshipId, `f1_${year}`))
      .limit(limit)
      .offset(offset)
      .orderBy(asc(driverClassifications.position))

    if (driversData.length === 0) {
      return apiNotFound(
        request,
        "No drivers found for this year, try with another one."
      )
    }

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit,
      offset,
      total: driversData.length,
      season: year,
      championshipId: `f1_${year}`,
      drivers: driversData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
