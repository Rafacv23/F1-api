import { generateRaceId, formatDriver, formatTeam } from "../utils.js"
import { clientWriter } from "../../turso.js"

export const getSprintRaceResults = async (year, race, page) => {
  const raceId = generateRaceId(race, year)
  //const raceId = "qatar_2024"
  const raceNumber = 1255 // Refers to the race number of the grand prix, its the id of the f1 page
  const url = `https://www.formula1.com/en/results/${year}/races/${raceNumber}/${race}/sprint-results`

  await page.goto(url)

  await page.waitForSelector(
    'table[class="f1-table f1-table-with-data w-full"]'
  )

  const results = await page.evaluate(() => {
    const table = document.querySelector(
      'table[class="f1-table f1-table-with-data w-full"]'
    )
    const rows = table?.querySelectorAll("tbody tr")
    const data = []

    rows?.forEach((row) => {
      const columns = row.querySelectorAll("td p")
      const position = columns[0]?.innerText.split("\n")[0].trim() || null
      const driver = columns[2]?.innerText.trim().toLowerCase() || null
      const team = columns[3]?.innerText.trim().toLowerCase() || null
      const laps = columns[4]?.innerText.trim().toLowerCase() || null
      const raceTime = columns[5]?.innerText.split("\n")[0].trim() || null
      const points = columns[6]?.innerText.split("\n")[0].trim() || null

      data.push({
        position,
        driver,
        team,
        laps,
        raceTime,
        points,
      })
    })

    return data
  })

  // now we need to get the sprint grid position
  const sprintUrl = `https://www.formula1.com/en/results/${year}/races/${raceNumber}/${race}/sprint-grid`
  await page.goto(sprintUrl)

  await page.waitForSelector(
    'table[class="f1-table f1-table-with-data w-full"]'
  )

  const qualyResults = await page.evaluate(() => {
    const table = document.querySelector(
      'table[class="f1-table f1-table-with-data w-full"]'
    )
    const rows = table?.querySelectorAll("tbody tr")
    const data = []

    rows?.forEach((row) => {
      const columns = row.querySelectorAll("td p")
      const gridPosition = columns[0]?.innerText.split("\n")[0].trim() || null
      const driver = columns[2]?.innerText.trim().toLowerCase() || null

      data.push({
        gridPosition,
        driver,
      })
    })

    return data
  })

  const sprintQualyResults = qualyResults.map((result) => {
    return {
      driverId: formatDriver(result.driver),
      gridPosition: result.gridPosition,
    }
  })

  const formattedResults = results.map((result) => {
    return {
      Race_ID: raceId,
      Driver_ID: formatDriver(result.driver),
      Team_ID: formatTeam(result.team, result.driver),
      Finishing_Position: result.position,
      Laps: result.laps,
      Race_Time: result.raceTime,
      Points_Obtained: parseInt(result.points), // Asumiendo que los puntos siempre son numéricos y en el formato "X"
    }
  })

  // now, with the sprint grid and the sprint race results, we can merge them in one

  const mergedResults = formattedResults.map((result) => {
    // Find the matching sprint grid result for the driver
    const sprintQualy = sprintQualyResults.find(
      (qualy) => qualy.driverId === result.Driver_ID
    )

    // Return a new object with the merged data
    return {
      ...result, // Keep all existing properties
      Grid_Position: sprintQualy?.gridPosition || null, // Add grid position if found, else null
    }
  })

  //console.log(mergedResults)
  ;async () => {
    const sprintRaceResults = await mergedResults

    if (Array.isArray(sprintRaceResults) && sprintRaceResults.length > 0) {
      for (const result of sprintRaceResults) {
        try {
          await clientWriter.execute({
            sql: `INSERT INTO Sprint_Race (Driver_ID, Race_ID, Team_ID, Finishing_Position, Grid_Position, Laps, Race_Time, Points_Obtained) VALUES (:Driver_ID, :Race_ID, :Team_ID, :Finishing_Position, :Grid_Position, :Laps, :Race_Time, :Points_Obtained)`,
            args: {
              Driver_ID: result.Driver_ID,
              Race_ID: raceId,
              Team_ID: result.Team_ID,
              Finishing_Position: result.Finishing_Position,
              Grid_Position: result.Grid_Position,
              Laps: result.Laps,
              Race_Time: result.Race_Time,
              Points_Obtained: result.Points_Obtained,
            },
          })
          console.log("Race Results inserted correctly")
        } catch (error) {
          console.error("Error inserting race results:", error)
        }
      }
    }
  }
}
