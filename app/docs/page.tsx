import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SITE_URL } from "@/lib/constants"
import EndpointsList from "@/components/EndpointsList"

export default function Docs() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">F1 API Documentation</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="mb-6">
        Welcome to the Formula 1 API! This API provides access to a wealth of
        data related to Formula 1 races, drivers, teams, circuits, and more.
      </p>
      <p className="mb-6">
        All the data its provided in JSON format and its ready to use. Simply
        fetch {SITE_URL} with the endpoint that you like.
      </p>
      <EndpointsList />
    </main>
  )
}
