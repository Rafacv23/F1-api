import { clientWriter } from "./turso.js"

const endpoint = "seasons"
const limit = 100
const url = `https://ergast.com/api/f1/${endpoint}.json?limit=${limit}`

async function fetchData() {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    const seasons = data.MRData.SeasonTable.Seasons
    return seasons
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

const generateId = (year) => {
  return `f1_${year}`
}

const generateName = (year) => {
  return `${year} Formula 1 World Championship`
}

export const insert = async (data) => {
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
    console.error("Error inserting or updating game:", error)
    throw error
  }
}

fetchData()
