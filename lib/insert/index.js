import { insertDrivers } from "./drivers.js"
import { insertTeams } from "./teams.js"
import { insertSeasons } from "./seasons.js"
import { insertDriversChampionship } from "./driversChampionship.js"
import { insertTeamsChampionship } from "./teamsChampionship.js"
import { insertCircuits } from "./circuits.js"
import { insertRacesPerYear } from "./races.js"
import { insertResults } from "./results.js"
import { insertQualy } from "./qualy.js"

async function fetchData() {
  const endpoint = "circuits"
  const limit = 999
  const url = `https://ergast.com/api/f1/${endpoint}.json?limit=${limit}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    const circuits = data.MRData.CircuitTable.Circuits
    console.log("Fetched circuits:", circuits)
    return circuits
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

async function fetchDataWithYear(year) {
  const endpoint = "qualifying"
  const limit = 999
  const url = `https://ergast.com/api/f1/${year}/${endpoint}.json?limit=${limit}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    const races = data.MRData.RaceTable.Races
    return races
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

// ;(async () => {
//   const circuits = await fetchData()
//   // Ensure the data is an array and has items before inserting
//   if (Array.isArray(circuits) && circuits.length > 0) {
//     await insertCircuits(circuits)
//   } else {
//     console.error("No valid circuits data to insert")
//   }
// })()

;(async () => {
  for (let year = 1950; year <= 2023; year++) {
    const racesData = await fetchDataWithYear(year)
    if (Array.isArray(racesData) && racesData.length > 0) {
      await insertQualy(racesData) // Insert race results
    } else {
      console.error("No valid data to insert for year:", year)
    }
  }
})()

//? para las temporadas 2020 hasta 2023 usar el raceName para el raceId de 1950 a 2019 usar el circuitId
//TODO: https://ergast.com/api/f1/2021/10/sprint.json

//*DONE: https://ergast.com/api/f1/2008/results.json?limit=999 cuidado con los límites, se puede ir carrera a carerra
//*DONE: https://ergast.com/api/f1/2008/qualifying.json?limit=999
//*DONE: http://ergast.com/api/f1/2008/driverStandings.json
//*DONE: https://ergast.com/api/f1/1958/constructorStandings.json
//*DONE: https://ergast.com/api/f1/circuits.json?limit=999
//*DONE: https://ergast.com/api/f1/1950/races.json?limit=999
