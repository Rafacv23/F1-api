import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import endpoints from "@/content/endpoints.json"
import Link from "next/link"

export default function EnpointPage({
  params,
}: Readonly<{ params: { endpoint: string } }>) {
  const filteredEnpoints = endpoints.find(
    (endpoint) => endpoint.section === params.endpoint
  )

  if (!filteredEnpoints) {
    return <p>No endpoints found for this section.</p>
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">{filteredEnpoints.title}</h1>
      <p className="mb-4">Here is the description of the endpoints</p>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredEnpoints.endpoints.map((endpoint) => (
          <li key={endpoint.id}>
            <Link href={`/docs/${filteredEnpoints.id}/${endpoint.id}`}>
              <Card>
                <CardHeader className="hover:text-f1 hover:transition-colors">
                  <CardTitle>{endpoint.title}</CardTitle>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
