// Insert race results to the database
import { clientWriter } from "../turso.js"
import { generateRaceId } from "./utils.js"

export const insertQualy = async (races) => {
  try {
    for (const race of races) {
      if (!race.QualifyingResults || race.QualifyingResults.length === 0) {
        console.log(
          `No qualifying results for race: ${
            race.raceName || race.Circuit.circuitId
          } in season: ${race.season}`
        )
        continue
      }
      const raceId = generateRaceId(
        race.season < 2020 ? race.Circuit.circuitId : race.raceName,
        race.season
      )

      for (const result of race.QualifyingResults) {
        console.log(raceId, result.Driver.driverId)
        await clientWriter.execute({
          sql: `INSERT INTO Classifications (Race_ID, Driver_ID, Team_ID, Q1, Grid_Position, Q2, Q3 )
          VALUES (:Race_ID, :Driver_ID, :Team_ID, :Q1, :Grid_Position, :Q2, :Q3 )`,
          args: {
            Race_ID: raceId,
            Driver_ID: result.Driver.driverId,
            Team_ID: result.Constructor.constructorId,
            Grid_Position: result.position,
            Q1: result.Q1 || null,
            Q2: result.Q2 || null,
            Q3: result.Q3 || null,
          },
        })
      }
    }
  } catch (error) {
    console.error("Error inserting or updating qualy results:", error)
    throw error
  }
}
