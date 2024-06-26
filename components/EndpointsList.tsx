import React from "react"
import endpoints from "@/app/data/endpoints.json"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"

export default function EndpointsList() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Endpoints</h2>
      <Table className="mb-8">
        <TableCaption>A list of all the API endpoints.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Endpoint</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Example</TableHead>
            <TableHead className="text-right">Params</TableHead>
            <TableHead className="text-right">Default</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.map((endpoint) => (
            <TableRow key={endpoint.url}>
              <TableCell className="font-medium">{endpoint.title}</TableCell>
              <TableCell>{endpoint.description}</TableCell>
              <TableCell>
                <Link
                  href={endpoint.url}
                  title={endpoint.url}
                  className="hover:text-blue-500 hover:transition-colors hover:underline"
                >
                  {endpoint.url}
                </Link>
              </TableCell>
              <TableCell>{endpoint.params}</TableCell>
              <TableCell>{endpoint.default}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
