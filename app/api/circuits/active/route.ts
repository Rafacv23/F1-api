import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"
import { apiNotFound } from "@/lib/utils"
import { BaseApiResponse } from "@/lib/definitions"

export const revalidate = 600

interface ApiResponse extends BaseApiResponse {
  year: string
  total: number
  circuits: any[]
}

export async function GET(request: Request) {
  const queryParams = new URL(request.url).searchParams
  const yearParam = queryParams.get("year")
  const currentYear = new Date().getFullYear()

  let year = yearParam ?? String(currentYear)

  try {
    let res = await fetch(`${SITE_URL}/api/${year}`, {
      cache: "no-store",
    })

    // fallback to previous year if current year is not available
    if (!res.ok && !yearParam) {
      year = String(currentYear - 1)
      res = await fetch(`${SITE_URL}/api/${year}`, {
        cache: "no-store",
      })
    }

    if (!res.ok) {
      return apiNotFound(request, "No races found for the given year.")
    }

    const data = await res.json()

    if (!Array.isArray(data.races)) {
      return NextResponse.json(
        { message: "Invalid data format received from external API" },
        { status: 500 }
      )
    }

    const circuits = data.races.map((race: any) => race.circuit)

    const response: ApiResponse = {
      api: SITE_URL,
      url: request.url,
      year,
      total: circuits.length,
      circuits,
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=60",
      },
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}
