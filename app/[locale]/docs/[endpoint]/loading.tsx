import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

export default function loading() {
  return (
    <div className="max-w-3xl flex flex-col gap-4">
      <Skeleton className="h-20" />
      <Skeleton className="h-10" />
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[...Array(6)].map((_, index) => (
          <li key={index}>
            <Skeleton className="h-40" />
          </li>
        ))}
      </ul>
    </div>
  )
}
