import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { parseISO, format } from "date-fns"
import { toZonedTime } from "date-fns-tz"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// return error message when the api not found any result.

import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"

export function apiNotFound(request: Request, message: string) {
  return NextResponse.json(
    {
      api: SITE_URL,
      url: request.url,
      message: message,
      status: 404,
    },
    {
      status: 404,
    }
  )
}

export function copyUrlToClipboard(url: string) {
  const destination = SITE_URL + "/" + url
  navigator.clipboard.writeText(destination)
}

export function getYear(): number {
  const year = new Date().getFullYear()
  return year
}

export function getDay(): string {
  const today = new Date().toISOString().split("T")[0] // Fecha actual en formato YYYY-MM-DD
  return today
}

export const getLimitAndOffset = (queryParams: URLSearchParams) => {
  const limit = parseInt(queryParams.get("limit") || "30", 10) // Default to 30
  const offset = parseInt(queryParams.get("offset") || "0", 10) // Default to 0

  return { limit, offset }
}

export function convertToTimezone(
  date: string | null,
  time: string | null,
  timezone: string | null
) {
  if (!date || !time || !timezone) return { date, time }

  try {
    const isoString = `${date}T${time}` // UTC time
    const zoned = toZonedTime(isoString, timezone)

    return {
      date: format(zoned, "yyyy-MM-dd"),
      time: format(zoned, "HH:mm:ss"),
    }
  } catch (e) {
    return { date, time } // fallback to original on error
  }
}
