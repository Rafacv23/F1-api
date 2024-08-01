// Insert race results to the database
import { clientWriter } from "../turso.js"
import { generateRaceId } from "./utils.js"

export const insertResults = async (races) => {
  try {
    for (const race of races) {
      const raceId = generateRaceId(
        race.season < 2020 ? race.Circuit.circuitId : race.raceName,
        race.season
      )

      for (const result of race.Results) {
        console.log(raceId, result.Driver.driverId)
        await clientWriter.execute({
          sql: `INSERT INTO Results (Race_ID, Driver_ID, Team_ID, Finishing_Position, Grid_Position, Race_Time, Points_Obtained )
          VALUES (:Race_ID, :Driver_ID, :Team_ID, :Finishing_Position, :Grid_Position, :Race_Time, :Points_Obtained )`,
          args: {
            Race_ID: raceId,
            Driver_ID: result.Driver.driverId,
            Team_ID: result.Constructor.constructorId,
            Finishing_Position: result.position,
            Grid_Position: result.grid,
            Race_Time: result.Time
              ? result.status !== "Finished"
                ? result.status
                : result.Time.time
              : result.status,
            Points_Obtained: result.points,
          },
        })
      }
    }
  } catch (error) {
    console.error("Error inserting or updating results:", error)
    throw error
  }
}
