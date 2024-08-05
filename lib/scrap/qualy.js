import { formatDriver, formatTeam, generateRaceId } from "./utils.js"
import { clientWriter } from "../turso.js"

export const getQualyResults = async (year, race, page) => {
  const raceId = generateRaceId(race, year)

  const url = `https://www.bbc.com/sport/formula1/${year}/${race}-grand-prix/results#Qualifying`

  await page.goto(url)

  await page.waitForSelector('table[aria-label="Qualification"]')

  const results = await page.evaluate(() => {
    const table = document.querySelector('table[aria-label="Qualification"]')
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
      let q1Time = columns[6]?.innerText.split("\n")[0].trim() || null
      let q2Time = columns[11]?.innerText.split("\n")[0].trim() || null
      let q3Time = columns[14]?.innerText.split("\n")[0].trim() || null

      if (q1Time && q1Time.includes("fastest lap")) {
        q1Time = q1Time.replace("fastest lap", "").trim()
      }
      if (q2Time && q2Time.includes("fastest lap")) {
        q2Time = q2Time.replace("fastest lap", "").trim()
      }
      if (q3Time && q3Time.includes("fastest lap")) {
        q3Time = q3Time.replace("fastest lap", "").trim()
      }

      data.push({
        position,
        driver,
        team,
        q1Time: q1Time === "not available" ? null : q1Time,
        q2Time: q2Time === "not available" ? null : q2Time,
        q3Time: q3Time === "not available" ? null : q3Time,
      })
    })

    return data
  })

  const formattedResults = results.map((result) => {
    return {
      Race_ID: raceId,
      Driver_ID: formatDriver(result.driver),
      Team_ID: formatTeam(result.team),
      Grid_Position: result.position,
      Q1: result.q1Time || null,
      Q2: result.q2Time || null,
      Q3: result.q3Time || null,
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
            sql: `INSERT INTO Classifications (Driver_ID, Race_ID, Team_ID, Q1, Grid_Position, Q2, Q3) VALUES (:Driver_ID, :Race_ID, :Team_ID, :Q1, :Grid_Position, :Q2, :Q3)`,
            args: {
              Driver_ID: result.Driver_ID,
              Race_ID: raceId,
              Team_ID: result.Team_ID,
              Grid_Position: result.Grid_Position,
              Q1: result.Q1,
              Q2: result.Q2,
              Q3: result.Q3,
            },
          })
        } catch (error) {
          console.error("Error inserting race results:", error)
        }
      }
    } else {
      console.log("Error inserting data")
    }
  })()
}
