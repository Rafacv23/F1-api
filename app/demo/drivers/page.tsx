import type { Driver } from "@/lib/definitions"
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

export default async function Drivers() {
  const url = `${SITE_URL_API}drivers`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`)
  }

  const data = await res.json()

  return (
    <Table>
      <TableCaption>A list of all F1 Drivers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Driver</TableHead>
          <TableHead>Nationality</TableHead>
          <TableHead>Birthday</TableHead>
          <TableHead>Short_Name</TableHead>
          <TableHead className="text-right">Wiki</TableHead>
        </TableRow>
      </TableHeader>
      {data
        ? data.drivers.map((driver: Driver) => (
            <>
              <TableBody>
                <TableRow key={driver.driverId}>
                  <TableCell className="font-medium">
                    <a
                      href={`/demo/drivers/${driver.driverId}`}
                      title={`${driver.name} ${driver.surname}`}
                    >
                      {`${driver.name} ${driver.surname}`}
                    </a>
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${driver.country}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${driver.birthday}`}
                  </TableCell>
                  <TableCell className="font-medium">
                    {`${driver.shortName}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={driver.url}
                      title={driver.url}
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
