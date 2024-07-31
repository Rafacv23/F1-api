import { clientWriter } from "../turso.js"
import { generateChampionshipId } from "./utils.js"

export const insertDriversChampionship = async (drivers) => {
  try {
    for (const driverList of drivers) {
      for (const driver of driverList.DriverStandings) {
        // Insertar nuevo conductor
        await clientWriter.execute({
          sql: `
              INSERT INTO Driver_Classifications (Championship_ID, Driver_ID, Team_ID, Points, Position, wins)
              VALUES (:Championship_ID, :Driver_ID, :Team_ID, :Points, :Position, :wins)`,
          args: {
            Championship_ID: generateChampionshipId(driverList.season),
            Driver_ID: driver.Driver.driverId,
            Team_ID: driver.Constructors[0]?.constructorId, // Asume el primer constructor
            Points: driver.points,
            Position: driver.position || null, // Usar null si el valor no está presente
            wins: driver.wins || null, // Usar null si el valor no está presente
          },
        })
      }
    }
  } catch (error) {
    console.error("Error inserting or updating drivers:", error)
    throw error
  }
}
