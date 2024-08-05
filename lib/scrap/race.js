import { generateRaceId, formatDriver, formatTeam } from "./utils.js"
import { clientWriter } from "../turso.js"

export const getRaceResults = async (year, race, page) => {
  const raceId = generateRaceId(race, year)
  const url = `https://www.bbc.com/sport/formula1/${year}/${race}-grand-prix/results`

  await page.goto(url)

  await page.waitForSelector('table[aria-label="Race"]')

  const results = await page.evaluate(() => {
    const table = document.querySelector('table[aria-label="Race"]')
    const rows = table.querySelectorAll("tbody tr")
    const data = []

    rows.forEach((row) => {
      const columns = row.querySelectorAll("td div")
      const position =
        columns[0]
          ?.querySelector(`span[aria-hidden="true"]`)
          ?.innerText.split("\n")[0]
          .trim() || null
      const driver = columns[1]?.innerText.trim().toLowerCase() || null
      const team = columns[5]?.innerText.trim().toLowerCase() || null
      const gridPosition = columns[6]?.innerText.split("\n")[0].trim() || null
      const raceTime =
        columns[10]
          ?.querySelector(`span[aria-hidden="true"]`)
          ?.innerText.split("\n")[0]
          .trim() || null
      const points = columns[11]?.innerText.split("\n")[0].trim() || null

      data.push({
        position,
        driver,
        team,
        raceTime,
        points,
        gridPosition,
      })
    })

    return data
  })

  const formattedResults = results.map((result) => {
    return {
      Race_ID: raceId,
      Driver_ID: formatDriver(result.driver),
      Team_ID: formatTeam(result.team),
      Finishing_Position: result.position,
      Grid_Position: result.gridPosition,
      Race_Time: result.raceTime,
      Points_Obtained: parseInt(result.points), // Asumiendo que los puntos siempre son numéricos y en el formato "X"
    }
  })

  console.log(formattedResults)
  ;(async () => {
    const RaceResults = await formattedResults
    // Ensure the data is an array and has items before inserting
    if (Array.isArray(RaceResults) && RaceResults.length > 0) {
      for (const result of RaceResults) {
        try {
          await clientWriter.execute({
            sql: `INSERT INTO Results (Driver_ID, Race_ID, Team_ID, Finishing_Position, Grid_Position, Race_Time, Points_Obtained) VALUES (:Driver_ID, :Race_ID, :Team_ID, :Finishing_Position, :Grid_Position, :Race_Time, :Points_Obtained)`,
            args: {
              Driver_ID: result.Driver_ID,
              Race_ID: raceId,
              Team_ID: result.Team_ID,
              Finishing_Position: result.Finishing_Position,
              Grid_Position: result.Grid_Position,
              Race_Time: result.Race_Time,
              Points_Obtained: result.Points_Obtained,
            },
          })
        } catch (error) {
          console.error("Error inserting race results:", error)
        }
        try {
          await clientWriter.execute({
            sql: `UPDATE Races SET Winner_ID = :Winner_ID, Team_Winner_ID = :Team_Winner_ID WHERE Race_ID = :Race_ID`,
            args: {
              Winner_ID: formattedResults[0].Driver_ID,
              Team_Winner_ID: formattedResults[0].Team_ID,
              Race_ID: raceId,
            },
          })
        } catch (error) {
          console.error("Error updating races", error)
        }
      }
    } else {
      console.log("Error inserting data")
    }
  })()
}
