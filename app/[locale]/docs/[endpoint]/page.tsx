import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import endpoints from "@/content/endpoints.json"
import { t } from "i18next"
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
    <div className="max-w-3xl w-2/3 mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{filteredEnpoints.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-4">{filteredEnpoints.title}</h1>
      <p className="mb-4">{filteredEnpoints.description}</p>
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
