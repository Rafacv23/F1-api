import { clientWriter } from "../turso.js"
import { generateId, generateName } from "./utils.js"

export const insertSeasons = async (data) => {
  try {
    await clientWriter.execute({
      sql: `
          INSERT INTO Championships (Championship_ID, Championship_Name, Url, Year)
          VALUES (:Championship_ID, :Championship_Name, :Url, :Year)`,
      args: {
        Championship_ID: generateId(data.season),
        Championship_Name: generateName(data.season),
        Url: data.url,
        Year: data.season,
      },
    })
  } catch (error) {
    console.error("Error inserting or updating seasons:", error)
    throw error
  }
}
