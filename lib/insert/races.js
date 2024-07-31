import { clientWriter } from "../turso.js"
import { generateChampionshipId, generateRaceId } from "./utils.js"

export const insertRacesPerYear = async (races) => {
  try {
    for (const race of races.Races) {
      console.log(race.season, race.round)
      await clientWriter.execute({
        sql: `
              INSERT INTO Races (Race_ID, Championship_ID, Race_Name, Circuit, Race_Date, Race_Time, Qualy_Time, Qualy_Date, FP1_Date, FP1_Time, FP2_Date, FP2_Time, FP3_Date, FP3_Time, Sprint_Race_Date, Sprint_Race_Time, Round, Url)
              VALUES (:Race_ID, :Championship_ID, :Race_Name, :Circuit, :Race_Date, :Race_Time, :Qualy_Time, :Qualy_Date, :FP1_Date, :FP1_Time, :FP2_Date, :FP2_Time, :FP3_Date, :FP3_Time, :Sprint_Race_Date, :Sprint_Race_Time, :Round, :Url)`,
        args: {
          Race_ID: generateRaceId(
            race.season < 2020 ? race.Circuit.circuitId : race.raceName,
            race.season
          ),
          Championship_ID: generateChampionshipId(race.season),
          Race_Name: race.raceName,
          Circuit: race.Circuit.circuitId,
          Race_Date: race.date,
          Race_Time: race.time || null,
          Qualy_Time: race.Qualifying?.time || null,
          Qualy_Date: race.Qualifying?.date || null,
          FP1_Date: race.FirstPractice?.date || null,
          FP1_Time: race.FirstPractice?.time || null,
          FP2_Date: race.SecondPractice?.date || null,
          FP2_Time: race.SecondPractice?.time || null,
          FP3_Date: race.ThirdPractice?.date || null,
          FP3_Time: race.ThirdPractice?.time || null,
          Sprint_Race_Date: race.Sprint?.date || null,
          Sprint_Race_Time: race.Sprint?.time || null,
          Round: race.round,
          Url: race.url || null,
        },
      })
    }
  } catch (error) {
    console.error("Error inserting or updating races:", error)
    throw error
  }
}
