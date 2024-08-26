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
import initTranslations from "@/app/i18n"

export default async function EndpointsList({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["docs"])

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Endpoints</h2>
      <Table className="mb-8">
        <TableCaption>{t("table-caption")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Endpoint</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("example")}</TableHead>
            <TableHead className="text-right">{t("params")}</TableHead>
            <TableHead className="text-right">{t("default")}</TableHead>
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
                  className="hover:text-f1 hover:transition-colors hover:underline"
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
