import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Race } from "@/lib/definitions"

export default async function Round({
  params,
}: {
  params: { year: number; round: number }
}) {
  const url = `http://localhost:3000/api/${params.year}/${params.round}/qualy`

  const res = await fetch(url)

  const data = await res.json()

  return (
    <Table>
      <TableCaption>
        Qualification results for the {params.year}, {params.round} round of the
        F1 season.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Position</TableHead>
          <TableHead>Driver</TableHead>
          <TableHead>Constructor</TableHead>
          <TableHead className="text-right">Q1 Time</TableHead>
          <TableHead className="text-right">Q2 Time</TableHead>
          <TableHead className="text-right">Q3 Time</TableHead>
          <TableHead className="text-right">Grid</TableHead>
          <TableHead className="text-right">Wiki</TableHead>
        </TableRow>
      </TableHeader>
      {data
        ? data.RaceTable.Races.map((race: any) => (
            <TableBody key={race.round}>
              {race.Results.map((result: any, index: any) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {result.Grid_Position}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/demo/drivers/${result.Driver.driverId}`}
                      title={`${result.Driver.name} ${result.Driver.surname}`}
                    >
                      {`${result.Driver.name} ${result.Driver.surname}`}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/demo/teams/${result.Team.teamId}`}
                      title={result.Team.name}
                    >
                      {result.Team.name}
                    </a>
                  </TableCell>
                  <TableCell className="text-right">{result.Q1_Time}</TableCell>
                  <TableCell className="text-right">{result.Q2_Time}</TableCell>
                  <TableCell className="text-right">{result.Q3_Time}</TableCell>
                  <TableCell className="text-right">
                    {result.Grid_Position}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={result.Driver.url}
                      title={result.Driver.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {`wiki`}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ))
        : null}
    </Table>
  )
}
