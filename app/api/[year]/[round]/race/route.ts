import { NextResponse } from "next/server"
import { client } from "@/app/lib/turso.js"
import { SITE_URL } from "@/lib/constants"

export async function GET(request: Request, context: any) {
  const { year, round } = context.params
  const limit = 30
  const sql = `
    SELECT Results.*, Races.*, Drivers.*, Teams.*, Circuits.*
    FROM Results
    JOIN Races ON Results.Race_ID = Races.Race_ID
    JOIN Championships ON Races.Championship_ID = Championships.Championship_ID
    JOIN Drivers ON Results.Driver_ID = Drivers.Driver_ID
    JOIN Teams ON Results.Team_ID = Teams.Team_ID
    JOIN Circuits ON Races.Circuit = Circuits.Circuit_ID
    WHERE Championships.Year = ? AND Races.Round = ?
    ORDER BY Results.Finishing_Position ASC
    LIMIT ?;
  `

  const data = await client.execute({
    sql: sql,
    args: [year, round, limit],
  })

  // Procesamos los datos de los resultados
  const processedData = data.rows.map((row) => ({
    position: row[4],
    points: row[8],
    Driver: {
      driverId: row[2],
      number: row[24],
      shortName: row[25],
      url: row[26],
      name: row[20],
      surname: row[21],
      nationality: row[22],
      birthday: row[23],
    },
    Constructor: {
      constructorId: row[3],
      name: row[28],
      nationality: row[29],
      firstAppareance: row[30],
      constructorsChampionships: row[31],
      driversChampionships: row[32],
      url: row[33],
    },
    grid: row[5],
    time: row[6],
    retired: row[7],
  }))

  // Obtener los datos del circuito
  const circuitData = {
    circuitId: data.rows[0][34],
    circuitName: data.rows[0][35],
    country: data.rows[0][36],
    city: data.rows[0][37],
    circuitLength: data.rows[0][38] + "km",
    lapRecord: data.rows[0][39],
    firstParticipationYear: data.rows[0][40],
    numberOfCorners: data.rows[0][41],
    fastestLapDriverId: data.rows[0][42],
    fastestLapTeamId: data.rows[0][43],
    fastestLapYear: data.rows[0][44],
    url: data.rows[0][45],
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
          url: data.rows[0][17],
          raceName: data.rows[0][11],
          Circuit: circuitData,
          date: data.rows[0][12],
          Results: processedData,
        },
      ],
    },
  })
}
