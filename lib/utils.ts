import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// return error message when the api not found any result.

import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/constants"

export function apiNotFound(request: Request, message: string) {
  return NextResponse.json({
    api: SITE_URL,
    url: request.url,
    message: message,
  })
}

export function copyUrlToClipboard(url: string) {
  const urlActual = window.location.href
  const destination = urlActual + "/" + url
  navigator.clipboard.writeText(destination)
}
