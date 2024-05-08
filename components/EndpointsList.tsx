import React from "react"
import Endpoint from "@/components/ui/Endpoint"
import endpoints from "@/app/data/endpoints.json"
export default function EndpointsList() {
  const data = endpoints
  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Endpoints</h2>
      <ul className="list-disc pl-6">
        {data.endpoints.map((endpoint) => (
          <Endpoint
            key={endpoint.title}
            url={endpoint.url}
            title={endpoint.title}
            description={endpoint.description}
          />
        ))}
      </ul>
    </>
  )
}
