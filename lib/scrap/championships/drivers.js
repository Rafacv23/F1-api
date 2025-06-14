// scrap the drivers championship and update the database with the new data (points, wins, etc)
import { clientWriter } from "../../turso.js"
import { formatDriver, formatTeam } from "../utils.js"

/*
    data we need 
    - Championship_ID string
    - Driver_ID string
    - Team_ID string
    - Points number
    - Position number
    - wins number | null
*/

export const updateDriversChampionship = async (year, page) => {
  const url = `https://www.bbc.com/sport/formula1/standings#Drivers`

  await page.goto(url)

  await page.waitForSelector("#Drivers")

  const standings = await page.evaluate(() => {
    const standingsTable = document.querySelector(
      `#Drivers table[aria-label="Formula 1 Drivers' Standings"]`
    )
    const rows = standingsTable.querySelectorAll("tbody tr")
    const data = []

    rows.forEach((row) => {
      const columns = row.querySelectorAll("td div")
      const position =
        columns[0]
          ?.querySelector(`span[aria-hidden="true"]`)
          ?.innerText.split("\n")[0]
          .trim() || null
      const driver = columns[3]?.innerText.trim().toLowerCase() || null
      const team = columns[5]?.innerText.trim().toLowerCase() || null
      const points = columns[8]?.innerText.split("\n")[0].trim() || null
      const wins =
        columns[7]
          ?.querySelector(`span[aria-hidden="true"]`)
          ?.innerText.split("\n")[0]
          .trim() || null

      data.push({
        position,
        driver,
        team,
        points,
        wins,
      })
    })

    return data
  })

  const formattedResults = standings.map((result) => {
    return {
      Championship_ID: `f1_${year}`,
      Driver_ID: formatDriver(result.driver),
      Team_ID: formatTeam(result.team),
      Points: parseInt(result.points),
      Position: parseInt(result.position),
      wins: result.wins == 0 ? null : parseInt(result.wins),
    }
  })

  // disable for debug console.log(formattedResults)

  // TODO: update the database
  ;(async () => {
    const driverStandings = await formattedResults
    // Ensure the data is an array and has items before inserting
    if (Array.isArray(driverStandings) && driverStandings.length > 0) {
      try {
        for (const driver of driverStandings) {
          await clientWriter.execute({
            sql: `
        UPDATE Driver_Classifications
        SET 
          Points = :Points,
          Position = :Position,
          wins = :wins
        WHERE 
          Championship_ID = :Championship_ID
          AND Driver_ID = :Driver_ID
      `,
            args: {
              Championship_ID: driver.Championship_ID,
              Driver_ID: driver.Driver_ID,
              Team_ID: driver.Team_ID,
              Points: driver.Points,
              Position: driver.Position,
              wins: driver.wins,
            },
          })
        }

        console.log("Driver Standings updated correctly")
      } catch (error) {
        console.error("Error updating data:", error)
      }
    } else {
      console.error("No valid data to insert")
    }
  })()
}
