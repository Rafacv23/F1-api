import { insertDrivers } from "./drivers.js"
import { insertTeams } from "./teams.js"
import { insertSeasons } from "./seasons.js"
import { insertDriversChampionship } from "./driversChampionship.js"
import { insertTeamsChampionship } from "./teamsChampionship.js"

const year = 1950
const endpoint = "driverStandings"
const limit = 999
const url = `https://ergast.com/api/f1/${year}/${endpoint}.json?limit=${limit}`

async function fetchData(year) {
  const endpoint = "driverStandings"
  const limit = 999
  const url = `https://ergast.com/api/f1/${year}/${endpoint}.json?limit=${limit}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    const drivers = data.MRData.StandingsTable.StandingsLists
    console.log("Fetched Drivers:", drivers) // Log fetched data
    return drivers
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

;(async () => {
  for (let year = 1950; year <= 2023; year++) {
    const drivers = await fetchData(year)
    // Ensure the data is an array and has items before inserting
    if (Array.isArray(drivers) && drivers.length > 0) {
      await insertDriversChampionship(drivers)
    } else {
      console.error("No valid drivers data to insert")
    }
  }
})()

//TODO: https://ergast.com/api/f1/1950/races.json?limit=999
//TODO: https://ergast.com/api/f1/2008/results.json?limit=999 cuidado con los límites, se puede ir carrera a carerra
//TODO: https://ergast.com/api/f1/2008/qualifying.json?limit=999
//TODO: https://ergast.com/api/f1/2021/10/sprint.json
//*DONE: http://ergast.com/api/f1/2008/driverStandings.json
//*DONE: https://ergast.com/api/f1/1958/constructorStandings.json
