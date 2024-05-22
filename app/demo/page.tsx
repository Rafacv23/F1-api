import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { Race } from "@/lib/definitions"
import { title } from "process"

export default async function Demo() {
  const currentYear = new Date().getFullYear()
  const url = `http://localhost:3000/api/${currentYear}`

  interface ApiResponse {
    api: string
    url: string
    limit: number
    total: number
    season: string
    races: Race[]
  }

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`)
  }

  const data: ApiResponse = await res.json()

  return (
    <Table>
      <TableCaption>
        A list of all F1 Races of the {currentYear} season.
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
                    <a
                      href={`/demo/drivers/${race.winner.driverId}`}
                      title={`${race.winner.driverId}`}
                    >
                      {`${race.winner.name} ${race.winner.surname}`}
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`/demo/teams/${race.teamWinner.teamId}`}
                      title={`${race.teamWinner.teamId}`}
                    >
                      {`${race.teamWinner.teamName}`}
                    </a>
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
