import { chromium } from "playwright"
import { getRaceResults } from "./race.js"
import { getQualyResults } from "./qualy.js"
import { getPracticeResults } from "./fp.js"
import { getSprintRaceResults } from "./sprint/race.js"
import { getSprintQualyResults } from "./sprint/qualy.js"
import { updateDriversChampionship } from "./championships/drivers.js"
import { updateTeamsChampionship } from "./championships/teams.js"
;(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()

  const page = await context.newPage()
  const year = 2025
  const race = "azerbaijan"

  //await getPracticeResults(year, race, page)
  //await getQualyResults(year, race, page)
  //await getSprintQualyResults(year, race, page)
  //await getSprintRaceResults(year, race, page)
  //await getRaceResults(year, race, page)
  //await updateDriversChampionship(year, page)
  await updateTeamsChampionship(year, page)

  await context.close()
  await browser.close()
})()
