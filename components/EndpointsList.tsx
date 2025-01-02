import React from "react"
import endpoints from "@/app/data/endpoints.json"
import { ExpandableCardList } from "@/components/ui/expandable-card-list"

export default async function EndpointsList({
  locale,
  value,
}: {
  locale: string
  value: string
}) {
  const filterEndpoints = endpoints.filter(
    (endpoint) => endpoint.value === value
  )

  return (
    <>
      <h2 className="text-2xl font-bold my-4">Endpoints</h2>
      <ExpandableCardList cards={filterEndpoints} />
    </>
  )
}
