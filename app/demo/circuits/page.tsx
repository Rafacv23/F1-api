import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SITE_URL_API } from "@/lib/constants"

import type { Circuit } from "@/lib/definitions"

export default async function Circuits() {
  const url = `${SITE_URL_API}circuits`

  const res = await fetch(url)

  const data = await res.json()

  return (
    <Table>
      <TableCaption>A list of all F1 teams.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Circuit</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>City</TableHead>
          <TableHead className="text-right">Wiki</TableHead>
        </TableRow>
      </TableHeader>
      {data
        ? data.circuits.map((circuit: Circuit) => (
            <>
              <TableBody>
                <TableRow key={circuit.circuitId}>
                  <TableCell className="font-medium">
                    <a
                      href={`/demo/circuits/${circuit.circuitId}`}
                    >{`${circuit.circuitName}`}</a>
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${circuit.country}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${circuit.city}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={circuit.url}
                      title={circuit.url}
                      target="_blank"
                      rel="noreferrer"
                    >{`wiki`}</a>
                  </TableCell>
                </TableRow>
              </TableBody>
            </>
          ))
        : null}
    </Table>
  )
}
