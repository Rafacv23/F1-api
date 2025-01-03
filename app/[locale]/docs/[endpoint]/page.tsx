import ArrayBread from "@/components/ArrayBread"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import endpoints from "@/content/endpoints.json"
import { SITE_NAME } from "@/lib/constants"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export async function generateStaticParams() {
  return endpoints.map((endpoint) => ({
    params: { endpoint: endpoint.section },
  }))
}

type Props = {
  params: { endpoint: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const filteredEnpoints = endpoints.find(
    (endpoint) => endpoint.section === params.endpoint
  )

  return {
    title: `Docs: ${filteredEnpoints?.title} | ${SITE_NAME}`,
    description: `Discover all the available endpoints from ${SITE_NAME}.`,
  }
}

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
    <div className="max-w-5xl md:w-2/3 mx-auto">
      <ArrayBread
        items={[
          { label: "Docs", link: "/docs" },
          {
            label: filteredEnpoints.title,
            link: `/docs/${filteredEnpoints.id}`,
          },
        ]}
      />

      <h1 className="text-3xl font-bold mb-4">{filteredEnpoints.title}</h1>
      <p className="mb-4">{filteredEnpoints.description}</p>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredEnpoints.endpoints.map((endpoint) => (
          <li key={endpoint.id}>
            <Link href={`/docs/${filteredEnpoints.id}/${endpoint.id}`}>
              <Card className="min-h-36">
                <CardHeader className="hover:text-f1 hover:transition-colors">
                  <CardTitle>{endpoint.title}</CardTitle>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 place-content-center flex">
        <Link className={buttonVariants({ variant: "link" })} href={`/`}>
          <ArrowLeft size={16} />
          Home
        </Link>
        <Link className={buttonVariants({ variant: "link" })} href={`/docs`}>
          See other endpoints
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
