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
          const team = columns[2]?.innerText.trim() || null
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

    console.log(data)

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
}
