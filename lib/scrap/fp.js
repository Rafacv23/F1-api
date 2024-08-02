import { generateRaceId } from "./utils.js"

export const getPracticeResults = async (year, race, page) => {
  const raceId = generateRaceId(race, year)

  const url = `https://www.bbc.com/sport/formula1/${year}/${race}-grand-prix/results#Practice`
}
