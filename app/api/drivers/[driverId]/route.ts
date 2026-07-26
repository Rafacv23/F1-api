import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound, getDriverImageUrl } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"
import { db } from "@/db"
import { drivers } from "@/db/migrations/schema"
import { eq, InferModel } from "drizzle-orm"

export const revalidate = 600

type Driver = InferModel<typeof drivers>

interface ApiResonse extends BaseApiResponse {
  driver: Driver[]
}

export async function GET(request: Request, context: any) {
  try {
    const { driverId } = context.params
    const limit = 1

    const driverData = await db
      .select()
      .from(drivers)
      .where(eq(drivers.driverId, driverId))
      .limit(limit)

    if (driverData.length === 0) {
      return apiNotFound(
        request,
        "No driver found for this id, try with other one."
      )
    }

    driverData.forEach((driver) => {
      return {
        driverId: driver.driverId,
        name: driver.name,
        surname: driver.surname,
        country: driver.nationality,
        birthday: driver.birthday,
        number: driver.number,
        shortName: driver.shortName,
        url: driver.url,
        image: getDriverImageUrl(driver.driverId),
      }
    })

    const response: ApiResonse = {
      api: SITE_URL,
      url: request.url,
      total: driverData.length,
      driver: driverData.map((driver) => ({
        ...driver,
        image: getDriverImageUrl(driver.driverId),
      })),
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
