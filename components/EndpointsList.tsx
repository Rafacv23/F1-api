import React from "react"
import endpoints from "@/app/data/endpoints.json"
import initTranslations from "@/app/i18n"
import { ExpandableCardList } from "./ui/expandable-card-list"

export default async function EndpointsList({
  locale,
  value,
}: {
  locale: string
  value: string
}) {
  const { t } = await initTranslations(locale, ["docs"])

  const filterEndpoints = endpoints.filter(
    (endpoint) => endpoint.value === value
  )

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Endpoints</h2>
      <ExpandableCardList cards={filterEndpoints} />
    </>
  )
}
