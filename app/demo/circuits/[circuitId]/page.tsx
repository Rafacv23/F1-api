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

export default async function Circuits({
  params,
}: {
  params: { circuitId: string }
}) {
  const url = `${SITE_URL_API}circuits/${params.circuitId}`

  const res = await fetch(url)

  const data = await res.json()

  return (
    <Table>
      <TableCaption>A list of all F1 teams.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Circuit</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Length (km)</TableHead>
          <TableHead>First participation year</TableHead>
          <TableHead>Corners</TableHead>
          <TableHead>Fastest Lap</TableHead>
          <TableHead>Fastest Lap Driver</TableHead>
          <TableHead>Fastest Lap Team</TableHead>
          <TableHead>Fastest Lap Year</TableHead>
          <TableHead className="text-right">Wiki</TableHead>
        </TableRow>
      </TableHeader>
      {data
        ? data.circuits.map((circuit: Circuit) => (
            <>
              <TableBody>
                <TableRow key={circuit.circuitId}>
                  <TableCell className="font-medium">{`${circuit.circuitName}`}</TableCell>
                  <TableCell className="font-medium">
                    {`${circuit.country}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${circuit.city}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${circuit.circuitLength}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${circuit.firstParticipationYear}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${circuit.corners}`}
                  </TableCell>
                  <TableCell className="font-medium">{`${circuit.lapRecord}`}</TableCell>
                  <TableCell className="font-medium">
                    <a
                      href={`/demo/drivers/${circuit.fastestLapDriverId}`}
                      title={circuit.fastestLapDriverId}
                    >
                      {`${circuit.fastestLapDriverId}`}
                    </a>
                  </TableCell>
                  <TableCell className="font-medium">
                    <a
                      href={`/demo/teams/${circuit.fastestLapTeamId}`}
                      title={circuit.fastestLapTeamId}
                    >
                      {`${circuit.fastestLapTeamId}`}
                    </a>
                  </TableCell>
                  <TableCell className="font-medium">{`${circuit.fastestLapYear}`}</TableCell>
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
