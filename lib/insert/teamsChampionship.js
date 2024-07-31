import { clientWriter } from "../turso.js"
import { generateChampionshipId } from "./utils.js"

export const insertTeamsChampionship = async (teams) => {
  try {
    for (const teamsList of teams) {
      for (const team of teamsList.ConstructorStandings) {
        // Insertar nuevo conductor
        await clientWriter.execute({
          sql: `
              INSERT INTO Constructors_Classifications (Championship_ID, Team_ID, Points, Position, wins)
              VALUES (:Championship_ID, :Team_ID, :Points, :Position, :wins)`,
          args: {
            Championship_ID: generateChampionshipId(teamsList.season),
            Team_ID: team.Constructor.constructorId,
            Points: team.points,
            Position: team.position || null, // Usar null si el valor no está presente
            wins: team.wins || null, // Usar null si el valor no está presente
          },
        })
      }
    }
  } catch (error) {
    console.error("Error inserting or updating teams:", error)
    throw error
  }
}
