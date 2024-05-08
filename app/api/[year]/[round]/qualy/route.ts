import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"
import { SITE_URL } from "@/lib/constants"

export async function GET(request: Request, context: any) {
  const { year, round } = context.params
  const limit = 30
  const sql = `
    SELECT Classifications.*, Races.*, Drivers.*, Teams.*, Circuits.*
    FROM Classifications
    JOIN Races ON Classifications.Race_ID = Races.Race_ID
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    JOIN Drivers ON Classifications.Driver_ID = Drivers.Driver_ID
    JOIN Teams ON Classifications.Team_ID = Teams.Team_ID
    JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
    WHERE Championships.Year = ? AND Races.Round = ?
    ORDER BY Classifications.Grid_Position ASC
    LIMIT ?;
  `

  const data = await client.execute({
    sql: sql,
    args: [year, round, limit],
  })

  // Procesamos los datos
  const processedData = data.rows.map((row) => ({
    Qualification_ID: row[0],
    Race_ID: row[1],
    Driver_ID: row[2],
    Team_ID: row[3],
    Q1_Time: row[4],
    Q2_Time: row[5],
    Q3_Time: row[6],
    Grid_Position: row[7],
    Driver: {
      driverId: row[2],
      number: row[23],
      name: row[19],
      surname: row[20],
      shortName: row[24],
      url: row[25],
      nationality: row[21],
      birthday: row[22],
    },
    Team: {
      teamId: row[26],
      name: row[27],
      nationality: row[28],
      firstAppareance: row[29],
      constructorsChampionships: row[30],
      driversChampionships: row[31],
      url: row[32],
    },
  }))

  // Obtener el circuito correspondiente a la carrera
  const circuitData = {
    circuitId: data.rows[0][33],
    circuitName: data.rows[0][34],
    country: data.rows[0][35],
    city: data.rows[0][36],
    circuitLength: data.rows[0][37] + "km",
    lapRecord: data.rows[0][38],
    firstParticipationYear: data.rows[0][39],
    numberOfCorners: data.rows[0][40],
    fastestLapDriverId: data.rows[0][41],
    fastestLapTeamId: data.rows[0][42],
    fastestLapYear: data.rows[0][43],
    url: data.rows[0][44],
  }

  return NextResponse.json({
    api: SITE_URL,
    url: request.url,
    limit: limit,
    total: data.rows.length,
    RaceTable: {
      season: year,
      round: round,
      Races: [
        {
          season: year,
          round: round,
          url: data.rows[0][16],
          raceName: data.rows[0][10],
          Circuit: circuitData,
          date: data.rows[0][11],
          Results: processedData,
        },
      ],
    },
  })
}
