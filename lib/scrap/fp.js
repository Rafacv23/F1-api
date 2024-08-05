import { clientWriter } from "../turso.js"
import { generateRaceId, formatDriver, formatTeam } from "./utils.js"

export const getPracticeResults = async (year, race, page) => {
  const raceId = generateRaceId(race, year)

  const url = `https://www.bbc.com/sport/formula1/${year}/${race}-grand-prix/results#Practice`

  await page.goto(url)

  await page.waitForSelector("#Practice")

  const results = await page.evaluate(() => {
    const fp1Table = document.querySelector(
      `#Practice table[aria-label="First Practice"]`
    )
    const fp2Table = document.querySelector(
      `#Practice table[aria-label="Second Practice"]`
    )
    const fp3Table = document.querySelector(
      `#Practice table[aria-label="3rd Practice"]`
    )
    const data = []
    const tables = [fp1Table, fp2Table, fp3Table]

    tables.forEach((table, index) => {
      if (table) {
        const rows = table.querySelectorAll("tbody tr")
        rows.forEach((row) => {
          const columns = row.querySelectorAll("td div")
          const position =
            columns[0]
              ?.querySelector(`span[aria-hidden="true"]`)
              ?.innerText.split("\n")[0]
              .trim() || null
          const driver = columns[1]?.innerText.trim().toLowerCase() || null
          const team = columns[5]?.innerText.trim().toLowerCase() || null
          const time =
            columns[6]
              ?.querySelector(`span[aria-hidden="true"]`)
              ?.innerText.split("\n")[0]
              .trim() || null

          data.push({
            session: `FP${index + 1}`,
            position,
            driver,
            team,
            time,
          })
        })
      }
    })

    return data
  })

  const formattedResults = results.map((result) => {
    return {
      session: result.session,
      Race_ID: raceId,
      Driver_ID: formatDriver(result.driver),
      Team_ID: formatTeam(result.team),
      Time: result.time,
    }
  })

  console.log(formattedResults)
  ;(async () => {
    const fpResults = await formattedResults
    // Ensure the data is an array and has items before inserting
    if (Array.isArray(fpResults) && fpResults.length > 0) {
      try {
        for (const fp of fpResults) {
          let tableName
          if (fp.session === "FP1") {
            tableName = "FP1"
          } else if (fp.session === "FP2") {
            tableName = "FP2"
          } else if (fp.session === "FP3") {
            tableName = "FP3"
          }

          if (tableName) {
            await clientWriter.execute({
              sql: `INSERT INTO ${tableName} (Driver_ID, Race_ID, Team_ID, Time) VALUES (:Driver_ID, :Race_ID, :Team_ID, :Time)`,
              args: {
                Driver_ID: fp.Driver_ID,
                Race_ID: raceId,
                Team_ID: fp.Team_ID,
                Time: fp.Time,
              },
            })
          }
        }
      } catch (error) {
        console.error("Error inserting data:", error)
      }
    } else {
      console.error("No valid data to insert")
    }
  })()
}
