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
import { Race } from "@/lib/definitions"

export default async function Round({
  params,
}: {
  params: { year: number; round: number }
}) {
  const url = `${SITE_URL_API}${params.year}/${params.round}/race`

  const res = await fetch(url)

  const data = await res.json()

  return (
    <Table>
      <TableCaption>
        Race results for the {params.year}, {params.round} round of the F1
        season.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Position</TableHead>
          <TableHead>Driver</TableHead>
          <TableHead>Constructor</TableHead>
          <TableHead className="text-right">Points</TableHead>
          <TableHead className="text-right">
            <a
              href={`/demo/${params.year}/${params.round}/qualy`}
              title="Qualy Reults"
            >
              Grid
            </a>
          </TableHead>
          <TableHead className="text-right">Time</TableHead>
          <TableHead className="text-right">Wiki</TableHead>
        </TableRow>
      </TableHeader>
      {data
        ? data.RaceTable.Races.map((race: any) => (
            <>
              <TableBody key={race.round}>
                {race.Results.map((result: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {result.position}
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
                        href={`/demo/teams/${result.Constructor.constructorId}`}
                        title={result.Constructor.name}
                      >
                        {result.Constructor.name}
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      {result.points}
                    </TableCell>
                    <TableCell className="text-right">{result.grid}</TableCell>
                    <TableCell className="text-right">{result.time}</TableCell>
                    <TableCell className="text-right">
                      <a
                        href={result.Driver.url}
                        title={result.Driver.url}
                        target="_blank"
                        rel="noreferrer"
                      >{`wiki`}</a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          ))
        : null}
    </Table>
  )
}
