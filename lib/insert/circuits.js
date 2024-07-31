import { clientWriter } from "../turso.js"

export const insertCircuits = async (circuits) => {
  try {
    for (const circuit of circuits) {
      // Check if team already exists
      const result = await clientWriter.execute({
        sql: `SELECT COUNT(*) as count FROM Circuits WHERE Circuit_ID = :Circuit_ID`,
        args: {
          Circuit_ID: circuit.circuitId,
        },
      })

      // Access count from result rows
      const count = result.rows[0]?.count || 0

      if (count > 0) {
        console.log(
          `Circuit with ID ${circuit.circuitId} already exists. Skipping insertion.`
        )
        continue
      }
      await clientWriter.execute({
        sql: `
          INSERT INTO Circuits (Circuit_ID, Circuit_Name, Country, City, Url)
          VALUES (:Circuit_ID, :Circuit_Name, :Country, :City, :Url)`,
        args: {
          Circuit_ID: circuit.circuitId,
          Circuit_Name: circuit.circuitName,
          Country: circuit.Location.country,
          City: circuit.Location.locality,
          Url: circuit.url,
        },
      })
    }
  } catch (error) {
    console.error("Error inserting or updating circuits:", error)
    throw error
  }
}
