import { clientWriter } from "../turso.js"

export const insertTeams = async (teams) => {
  try {
    for (const team of teams) {
      // Check if team already exists
      const result = await clientWriter.execute({
        sql: `SELECT COUNT(*) as count FROM Teams WHERE Team_ID = :Team_ID`,
        args: {
          Team_ID: team.constructorId,
        },
      })

      // Access count from result rows
      const count = result.rows[0]?.count || 0

      if (count > 0) {
        console.log(
          `Team with ID ${team.constructorId} already exists. Skipping insertion.`
        )
        continue
      }

      // Insert new team if it doesn't exist
      await clientWriter.execute({
        sql: `
                INSERT INTO Teams (Team_ID, Team_Name, URL, Team_Nationality)
                VALUES (:Team_ID, :Team_Name, :URL, :Team_Nationality)`,
        args: {
          Team_ID: team.constructorId,
          Team_Name: team.name,
          URL: team.url,
          Team_Nationality: team.nationality,
        },
      })
    }
  } catch (error) {
    console.error("Error inserting or updating teams:", error)
    throw error
  }
}
