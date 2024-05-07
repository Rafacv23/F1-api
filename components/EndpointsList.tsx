import React from "react"
import Link from "next/link"

export default function EndpointsList() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Endpoints</h2>
      <h3 className="text-xl font-bold mb-2">Static Routes</h3>
      <ul className="list-disc pl-6">
        <li className="mb-2">
          <Link
            href="/api/seasons"
            title="/api/seasons"
            className="text-blue-500"
          >
            /api/seasons
          </Link>
          : Retrieve a list of all F1 Seasons, since the first one (1950) to the
          latest.
        </li>
        <li className="mb-2">
          <Link href="/api/drivers" className="text-blue-500">
            /api/drivers
          </Link>
          : Retrieve a list of all the Drivers who at least race one F1 race.
        </li>
        <li className="mb-2">
          <Link href="/api/teams" className="text-blue-500">
            /api/teams
          </Link>
          : Retrieve a list of all the teams that participated in Formula 1
          races.
        </li>
        <li className="mb-2">
          <Link href="/api/circuits" className="text-blue-500">
            /api/circuits
          </Link>
          : Retrieve the list of all the F1 circuits.
        </li>
      </ul>
      <h3 className="text-xl font-bold mb-2">Dynamic Routes</h3>
      <ul className="list-disc pl-6">
        <li className="mb-2">
          <Link href="/api/drivers/alonso" className="text-blue-500">
            /api/drivers/[driverId]
          </Link>
          : Retrieve a driver using his id. Example:{" "}
          <Link href={"/api/drivers/alonso"} className="text-blue-500">
            /api/drivers/alonso
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/api/teams/ferrari" className="text-blue-500">
            /api/teams/[teamId]
          </Link>
          : Retrieve a team using his id. Example:{" "}
          <Link href={"/api/teams/ferrari"} className="text-blue-500">
            /api/teams/ferrari
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/api/2024" className="text-blue-500">
            /api/[year]
          </Link>
          : Retrieve the races of the specefic year. Example:{" "}
          <Link href={"/api/2024"} className="text-blue-500">
            /api/2024
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/api/results/2024/1" className="text-blue-500">
            /api/[year]/[round]
          </Link>
          : Retrieve the information of a race based on the year and the round.
          Example:{" "}
          <Link href={"/api/2024/1"} className="text-blue-500">
            /api/2024/1
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/api/results/2024/1/qualy" className="text-blue-500">
            /api/[year]/[round]/qualy
          </Link>
          : Retrieve the information of the qualy of a race based on the year
          and the round. Example:{" "}
          <Link href={"/api/2024/1/qualy"} className="text-blue-500">
            /api/2024/1/qualy
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/api/results/2024/1/race" className="text-blue-500">
            /api/[year]/[round]/race
          </Link>
          : Retrieve the information of a specific race based on the year and
          the round. Example:{" "}
          <Link href={"/api/2024/1/race"} className="text-blue-500">
            /api/2024/1/race
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/api/2024/circuits" className="text-blue-500">
            /api/[year]/circuits
          </Link>
          : Retrieve a list of the circuits of the specefic F1 season. Example:{" "}
          <Link href={"/api/2024/circuits"} className="text-blue-500">
            /api/2024/circuits
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/api/2024/drivers" className="text-blue-500">
            /api/[year]/drivers
          </Link>
          : Retrieve a list of the F1 drivers of the specific season. Example:{" "}
          <Link href={"/api/2024/drivers"} className="text-blue-500">
            /api/2024/drivers
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/api/2024/teams" className="text-blue-500">
            /api/[year]/teams
          </Link>
          : Retrieve a list of the F1 Teams of the specific season. Example:{" "}
          <Link href={"/api/2024/teams"} className="text-blue-500">
            /api/2024/teams
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/api/2024/drivers-championship" className="text-blue-500">
            /api/[year]/drivers-championship
          </Link>
          : Retrieve the drivers championship standing of the specific season.
          Example:{" "}
          <Link
            href={"/api/2024/drivers-championship"}
            className="text-blue-500"
          >
            /api/2024/drivers-championship
          </Link>
        </li>
        <li className="mb-2">
          <Link
            href="/api/2024/constructors-championship"
            className="text-blue-500"
          >
            /api/[year]/constructors-championship
          </Link>
          : Retrieve the constructors championship standing of the specific
          season. Example:{" "}
          <Link
            href={"/api/2024/constructors-championship"}
            className="text-blue-500"
          >
            /api/2024/constructors-championship
          </Link>
        </li>
      </ul>
    </>
  )
}
