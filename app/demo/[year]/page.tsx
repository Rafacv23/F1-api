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

import type { Race } from "@/lib/definitions"

export default async function Year({ params }: { params: { year: number } }) {
  const url = `${SITE_URL_API}${params.year}`
  const res = await fetch(url)

  const data = await res.json()
  return (
    <Table>
      <TableCaption>
        A list of all F1 Races of the {params.year} season.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Round</TableHead>
          <TableHead>Race</TableHead>
          <TableHead>Country</TableHead>
          <TableHead className="text-right">Laps</TableHead>
          <TableHead className="text-right">Winner</TableHead>
          <TableHead className="text-right">Constructor</TableHead>
          <TableHead className="text-right">Wiki</TableHead>
        </TableRow>
      </TableHeader>
      {data
        ? data.races.map((race: Race) => (
            <>
              <TableBody>
                <TableRow key={race.raceId}>
                  <TableCell className="font-medium">{race.round}</TableCell>
                  <TableCell>{race.raceName}</TableCell>
                  <TableCell>{race.circuit.country}</TableCell>
                  <TableCell className="text-right">{race.laps}</TableCell>
                  <TableCell className="text-right">
                    {`${race.winner.name} ${race.winner.surname}`}
                  </TableCell>
                  <TableCell className="text-right">
                    {`${race.teamWinner.teamName}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={race.url}
                      title={race.url}
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
