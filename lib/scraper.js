import { chromium } from "playwright"

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()

  const page = await context.newPage()
  const url =
    "https://www.bbc.com/sport/formula1/2024/belgian-grand-prix/results"
  const raceId = "test"
  await page.goto(url)

  await page.waitForSelector('table[aria-label="Race"]')

  const results = await page.evaluate(() => {
    const table = document.querySelector('table[aria-label="Race"]')
    const rows = table.querySelectorAll("tbody tr")
    const data = []

    rows.forEach((row) => {
      const columns = row.querySelectorAll("td div")
      const position = columns[0]
        ? columns[0].innerText.split("\n")[0].trim()
        : null
      const driver = columns[1]
        ? columns[1].innerText.trim().toLowerCase()
        : null
      const team = columns[5] ? columns[5].innerText.trim().toLowerCase() : null
      const gridPosition = columns[6]
        ? columns[6].innerText.split("\n")[0].trim()
        : null
      const raceTime = columns[10]
        ? columns[10].innerText.split("\n")[0].trim()
        : null
      const points = columns[11]
        ? columns[11].innerText.split("\n")[0].trim()
        : null

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

  const formattedResults = results.map((result) => ({
    Result_ID: null,
    Race_ID: raceId, // Replace with the actual race ID
    Driver_ID: result.driver,
    Team_ID: result.team,
    Finishing_Position: result.position,
    Grid_Position: result.gridPosition,
    Race_Time: result.raceTime,
    //Retired: false,
    Points_Obtained: parseInt(result.points), // Assuming points are always numeric and in the format "X"
  }))

  console.log(formattedResults)

  const values = formattedResults
    .map(
      (result) =>
        `(${result.Result_ID}, '${result.Race_ID}', '${result.Driver_ID}', '${result.Team_ID}', '${result.Finishing_Position}', '${result.Grid_Position}', '${result.Race_Time}', ${result.Points_Obtained})`
    )
    .join(",")

  console.log(values)

  await context.close()
  await browser.close()
})()
