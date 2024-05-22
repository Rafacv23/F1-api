import type { Team } from "@/lib/definitions"
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

export default async function Teams() {
  const url = `${SITE_URL_API}teams`

  const res = await fetch(url)

  const data = await res.json()

  return (
    <Table>
      <TableCaption>A list of all F1 Teams.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Team</TableHead>
          <TableHead>Nationality</TableHead>
          <TableHead>First Appareance</TableHead>
          <TableHead>Drivers Championships</TableHead>
          <TableHead>Constructors Championships</TableHead>
          <TableHead className="text-right">Wiki</TableHead>
        </TableRow>
      </TableHeader>
      {data
        ? data.teams.map((team: Team) => (
            <>
              <TableBody>
                <TableRow key={team.teamId}>
                  <TableCell className="font-medium">
                    <a
                      href={`/demo/teams/${team.teamId}`}
                      title={team.teamName}
                    >
                      {`${team.teamName}`}
                    </a>
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${team.country}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${team.firstAppareance}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${team.driversChampionships}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${team.constructorsChampionships}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={team.url}
                      title={team.url}
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
