import { insertDrivers } from "./drivers.js"
import { insertTeams } from "./teams.js"
import { insertSeasons } from "./seasons.js"

const endpoint = "drivers"
const limit = 859
const url = `https://ergast.com/api/f1/${endpoint}.json?limit=${limit}`

async function fetchData() {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    const drivers = data.MRData.DriverTable.Drivers
    console.log("Fetched Drivers:", drivers) // Log fetched data
    return drivers
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

;(async () => {
  const drivers = await fetchData()

  // Ensure the data is an array and has items before inserting
  if (Array.isArray(drivers) && drivers.length > 0) {
    await insertDrivers(drivers)
  } else {
    console.error("No valid drivers data to insert")
  }
})()
