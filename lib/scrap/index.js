import { chromium } from "playwright"
import { getRaceResults } from "./race.js"
import { getQualyResults } from "./qualy.js"
import { getPracticeResults } from "./fp.js"
;(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()

  const page = await context.newPage()
  const year = 2024
  const race = "azerbaijan"

  //await getPracticeResults(year, race, page)
  //await getQualyResults(year, race, page)
  await getRaceResults(year, race, page)

  await context.close()
  await browser.close()
})()
