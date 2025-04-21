import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getLimitAndOffset } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { drivers } from "@/db/migrations/schema"
import { InferModel } from "drizzle-orm"

export const revalidate = 300

type Drivers = InferModel<typeof drivers>

interface ApiResponse extends BaseApiResponse {
  drivers: Drivers[]
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const { limit, offset } = getLimitAndOffset(queryParams)
  try {
    const driversData = await db
      .select()
      .from(drivers)
      .limit(limit)
      .offset(offset)
      .orderBy(drivers.driverId)

    if (driversData.length === 0) {
      return apiNotFound(request, "No drivers found.")
    }

    driversData.forEach((driver) => {
      return {
        driverId: driver.driverId,
        name: driver.name,
        surname: driver.surname,
        country: driver.nationality,
        birthday: driver.birthday,
        number: driver.number,
        shortName: driver.shortName,
        url: driver.url,
      }
    })

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      limit: limit,
      offset: offset,
      total: driversData.length,
      drivers: driversData,
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=60",
      },
      status: 200,
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
