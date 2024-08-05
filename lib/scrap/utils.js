export const generateRaceId = (race, year) => {
  return `${race}_${year}`
}

export const exceptions = ["max verstappen", "kevin magnussen"]
export const teamExceptions = ["red bull", "aston martin"]

export const formatDriver = (driver) => {
  let driverId

  if (exceptions.includes(driver)) {
    return (driverId = driver.replace(" ", "_"))
  } else if (driver === "carlos sainz jnr") {
    return (driverId = "sainz")
  } else if (driver === "zhou guanyu") {
    return (driverId = "zhou")
  } else {
    return (driverId = driver.split(" ").pop())
  }
}

export const formatTeam = (team) => {
  let teamId

  if (teamExceptions.includes(team)) {
    return (teamId = team.replace(" ", "_"))
  } else {
    return (teamId = team.split(" ").pop())
  }
}
