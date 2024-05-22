import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Championship } from "@/lib/definitions"

export default async function Seasons() {
  const url = `http://localhost:3000/api/seasons`

  const res = await fetch(url)

  const data = await res.json()

  return (
    <Table>
      <TableCaption>A list of all F1 Championships.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Championship</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Wiki</TableHead>
        </TableRow>
      </TableHeader>
      {data
        ? data.championships.map((championship: Championship) => (
            <>
              <TableBody>
                <TableRow key={championship.championshipId}>
                  <TableCell className="font-medium">
                    <a
                      href={`/demo/${championship.year}`}
                      title={championship.championshipName}
                    >{`${championship.championshipName}`}</a>
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${championship.year}`}
                  </TableCell>
                  <TableCell>
                    <a
                      href={championship.url}
                      title={championship.url}
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
