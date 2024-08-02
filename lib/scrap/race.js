import { generateRaceId, exceptions, teamExceptions } from "./utils.js"

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
    let driverId

    if (exceptions.includes(result.driver)) {
      driverId = result.driver.replace(" ", "_") // Reemplaza espacios por guiones bajos en los nombres completos
    } else if (result.driver === "carlos sainz jnr") {
      driverId = "sainz" // Maneja el caso especial de Carlos Sainz Jnr
    } else if (result.driver === "zhou guanyu") {
      driverId = "zhou"
    } else {
      driverId = result.driver.split(" ").pop() // Obtiene solo el apellido
    }

    let teamId

    if (teamExceptions.includes(result.team)) {
      teamId = result.team.replace(" ", "_")
    } else {
      teamId = result.team.split(" ").pop()
    }

    return {
      Race_ID: raceId,
      Driver_ID: driverId,
      Team_ID: teamId,
      Finishing_Position: result.position,
      Grid_Position: result.gridPosition,
      Race_Time: result.raceTime,
      Points_Obtained: parseInt(result.points), // Asumiendo que los puntos siempre son numéricos y en el formato "X"
    }
  })

  console.log(formattedResults)
}
