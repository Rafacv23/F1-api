import { generateRaceId, formatDriver, formatTeam } from "../utils.js"
import { clientWriter } from "../../turso.js"

export const getSprintQualyResults = async (year, race, page) => {
  const raceId = generateRaceId(race, year)
  //const raceId = "qatar_2024"
  const raceNumber = 1259 // Refers to the race number of the grand prix, its the id of the f1 page
  const url = `https://www.formula1.com/en/results/${year}/races/${raceNumber}/${race}/sprint-qualifying`

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
      const gridPosition = columns[0]?.innerText.split("\n")[0].trim() || null
      const driver = columns[2]?.innerText.trim().toLowerCase() || null
      const team = columns[3]?.innerText.trim().toLowerCase() || null
      const sq1 = columns[4]?.innerText.split("\n")[0].trim() || null
      const sq2 = columns[5]?.innerText.split("\n")[0].trim() || null
      const sq3 = columns[6]?.innerText.split("\n")[0].trim() || null

      data.push({
        gridPosition,
        driver,
        team,
        sq1,
        sq2,
        sq3,
      })
    })

    return data
  })

  const formattedResults = results.map((result) => {
    return {
      Race_ID: raceId,
      Driver_ID: formatDriver(result.driver),
      Team_ID: formatTeam(result.team, result.driver),
      Grid_Position: result.gridPosition,
      SQ1: result.sq1,
      SQ2: result.sq2,
      SQ3: result.sq3,
    }
  })

  console.log(formattedResults)
  ;(async () => {
    const QualyResults = await formattedResults
    // Ensure the data is an array and has items before inserting
    if (Array.isArray(QualyResults) && QualyResults.length > 0) {
      for (const result of QualyResults) {
        try {
          await clientWriter.execute({
            sql: `INSERT INTO Sprint_Qualy 
            (Driver_ID, Race_ID, Team_ID, Grid_Position, SQ1, SQ2, SQ3) 
            VALUES (:Driver_ID, :Race_ID, :Team_ID, :Grid_Position, :SQ1, :SQ2, :SQ3)`,
            args: {
              Driver_ID: result.Driver_ID,
              Race_ID: result.Race_ID,
              Team_ID: result.Team_ID,
              Grid_Position: result.Grid_Position,
              SQ1: result.SQ1,
              SQ2: result.SQ2,
              SQ3: result.SQ3,
            },
          })
          console.log("Qualy Results inserted correctly")
        } catch (error) {
          console.error("Error inserting race results:", error)
        }
      }
    } else {
      console.log("Error inserting data")
    }
  })()
}
