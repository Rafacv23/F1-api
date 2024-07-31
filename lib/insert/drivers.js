import { clientWriter } from "../turso.js"

export const insertDrivers = async (drivers) => {
  try {
    console.log("Inserting Drivers:", drivers)

    for (const driver of drivers) {
      // Check if driver already exists
      const result = await clientWriter.execute({
        sql: `SELECT COUNT(*) as count FROM Drivers WHERE Driver_ID = :Driver_ID`,
        args: {
          Driver_ID: driver.driverId,
        },
      })

      // Access count from result rows
      const count = result.rows[0]?.count || 0

      if (count > 0) {
        console.log(
          `Driver with ID ${driver.driverId} already exists. Skipping insertion.`
        )
        continue
      }

      // Insert new driver if it doesn't exist
      await clientWriter.execute({
        sql: `
                  INSERT INTO Drivers (Driver_ID, Name, Surname, Birthday, Nationality, Number, Short_Name, URL)
                  VALUES (:Driver_ID, :Name, :Surname, :Birthday, :Nationality, :Number, :Short_Name, :URL)`,
        args: {
          Driver_ID: driver.driverId,
          Name: driver.givenName,
          Surname: driver.familyName,
          Birthday: driver.dateOfBirth,
          Nationality: driver.nationality,
          Number: driver.permanentNumber || null, // Use null if the value is not present
          Short_Name: driver.code || null, // Use null if the value is not present
          URL: driver.url || null, // Use null if the value is not present
        },
      })
    }
  } catch (error) {
    console.error("Error inserting or updating drivers:", error)
    throw error
  }
}
