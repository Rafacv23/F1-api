// scrap the teams championship and update the database with the new data (points, wins, etc)
import { clientWriter } from "../../turso.js"
import { formatTeam } from "../utils.js"

/*
    data we need 
    - Championship_ID string
    - Team_ID string
    - Points number
    - Position number
    - wins number | null
*/

export const updateTeamsChampionship = async (year, page) => {
  const url = `https://www.bbc.com/sport/formula1/standings#Constructors`

  await page.goto(url)

  await page.waitForSelector("#Constructors")

  const standings = await page.evaluate(() => {
    const standingsTable = document.querySelector(
      `#Constructors table[aria-label="Formula 1 Constructors' Standings"]`
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
      const team = columns[1]?.innerText.trim().toLowerCase() || null
      const points = columns[4]?.innerText.split("\n")[0].trim() || null
      const wins =
        columns[3]
          ?.querySelector(`span[aria-hidden="true"]`)
          ?.innerText.split("\n")[0]
          .trim() || null

      data.push({
        position,
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
      Team_ID: formatTeam(result.team),
      Points: parseInt(result.points),
      Position: parseInt(result.position),
      wins: result.wins == 0 ? null : parseInt(result.wins),
    }
  })

  console.log(formattedResults)
  ;(async () => {
    const teamStandings = await formattedResults
    // Ensure the data is an array and has items before inserting
    if (Array.isArray(teamStandings) && teamStandings.length > 0) {
      try {
        for (const team of teamStandings) {
          await clientWriter.execute({
            sql: `
          UPDATE Constructors_Classifications
          SET
            Points = :Points,
            Position = :Position,
            wins = :wins
          WHERE
            Championship_ID = :Championship_ID
            AND Team_ID = :Team_ID
        `,
            args: {
              Championship_ID: team.Championship_ID,
              Team_ID: team.Team_ID,
              Points: team.Points,
              Position: team.Position,
              wins: team.wins,
            },
          })
        }

        console.log("Team Standings updated correctly")
      } catch (error) {
        console.error("Error updating data:", error)
      }
    } else {
      console.error("No valid data to insert")
    }
  })()
}
