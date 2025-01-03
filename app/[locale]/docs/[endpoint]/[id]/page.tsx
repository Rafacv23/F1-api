import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import endpoints from "@/content/endpoints.json"
import examples from "@/content/examples.json"
import responses from "@/content/responses.json"
import ArrayBread from "@/components/ArrayBread"
import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { SITE_NAME, SITE_URL } from "@/lib/constants"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import CopyBtn from "@/components/buttons/CopyBtn"
import { Metadata } from "next"

export async function generateStaticParams() {
  const paths = endpoints.flatMap((endpoint) =>
    endpoint.endpoints.map((subendpoint) => ({
      endpoint: endpoint.id,
      id: subendpoint.id,
    }))
  )

  return paths.map(({ endpoint, id }) => ({
    params: { endpoint, id },
  }))
}

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const section = endpoints.find((section) =>
    section.endpoints.some((subendpoint) => subendpoint.id === params.id)
  )

  const subendpoint = section?.endpoints.find(
    (subendpoint) => subendpoint.id === params.id
  )

  return {
    title: `${section?.title}: ${subendpoint?.title} | ${SITE_NAME}`,
    description: `Discover the ${subendpoint?.title} endpoint from ${SITE_NAME}.`,
  }
}

export default async function EnpointPage({
  params,
}: {
  params: { id: string }
}) {
  const section = endpoints.find((section) =>
    section.endpoints.some((subendpoint) => subendpoint.id === params.id)
  )

  if (!section) {
    return <p>Section not found.</p>
  }

  // Retrieve the specific subendpoint details
  const subendpoint = section?.endpoints.find(
    (subendpoint) => subendpoint.id === params.id
  )

  const example = examples.find((example) => example.enpointId === params.id)

  if (!subendpoint) {
    return <p>Subendpoint not found.</p>
  }

  return (
    <div className="max-w-4xl md:w-2/3 mx-auto">
      <ArrayBread
        items={[
          { label: "Docs", link: "/docs" },
          { label: section.title, link: `/docs/${section.url}` },
          {
            label: subendpoint.title,
            link: `/docs/${section.url}/${params.id}`,
          },
        ]}
      />
      <div className="flex flex-row justify-between items-center">
        <h1 id="start" className="text-2xl font-bold my-4">
          GET api/{subendpoint.title}
        </h1>
        <div className="flex gap-4 my-4 items-center">
          <CopyBtn text={`api/${subendpoint.url}`} />
          <Link
            href={`${SITE_URL}/api/${subendpoint.url}`}
            target="_blank"
            className={buttonVariants({
              variant: "outline",
              className: "flex gap-2 items-center",
            })}
          >
            Try it
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
      <p className="mb-4">{subendpoint.description}</p>
      <h2 id="example" className="my-4 text-xl font-semibold">
        Example Response
      </h2>
      <Card>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm relative w-full overflow-auto max-w-xs sm:max-w-sm md:max-w-max">
            {JSON.stringify(example?.exampleResponse, null, 2)}
          </pre>
        </CardContent>
      </Card>
      <h2 id="types" className="mt-4 text-xl font-semibold">
        Response Types
      </h2>
      <Table className="my-4">
        <TableHeader className="text-left">
          <TableRow>
            <TableHead className="w-[100px]">Field</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {example?.responseTypes.map((field) => (
            <TableRow key={field.field}>
              <TableCell className="font-medium">{field.field}</TableCell>
              <TableCell>{field.type}</TableCell>
              <TableCell>{field.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <h2 id="params" className="mt-4 text-xl font-semibold">
        Response Params
      </h2>
      {Array.isArray(subendpoint.params) ? (
        <Table className="my-4">
          <TableHeader className="text-left">
            <TableRow>
              <TableHead className="w-[100px]">Param</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subendpoint.params.map((param) => (
              <TableRow key={param.name}>
                <TableCell className="font-medium">{param.name}</TableCell>
                <TableCell>{param.default}</TableCell>
                <TableCell>{param.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : subendpoint.params ? (
        <p>{subendpoint.params}</p>
      ) : (
        <p>No params for this endpoint.</p>
      )}
      <h2 id="status" className="mt-4 text-xl font-semibold">
        Response Status
      </h2>
      <Table className="my-4">
        <TableHeader className="text-left">
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((response) => (
            <TableRow key={response.status}>
              <TableCell className="font-medium">{response.status}</TableCell>
              <TableCell>{response.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-8 place-content-center flex">
        <Link className={buttonVariants({ variant: "link" })} href={`/`}>
          <ArrowLeft size={16} />
          More {section.title} endpoints
        </Link>
        <Link className={buttonVariants({ variant: "link" })} href={`/docs`}>
          See other endpoints
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
