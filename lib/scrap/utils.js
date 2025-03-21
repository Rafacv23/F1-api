export const generateRaceId = (race, year) => {
  return `${race}_${year}`
}

// object array with the info of the current grid of the f1, includes drivers and his teams
export const grid = [
  {
    driver: "max_verstappen",
    team: "red_bull",
  },
  {
    driver: "lawson",
    team: "red_bull",
  },
  {
    driver: "hamilton",
    team: "ferrari",
  },
  {
    driver: "russell",
    team: "mercedes",
  },
  {
    driver: "sainz",
    team: "williams",
  },
  {
    driver: "leclerc",
    team: "ferrari",
  },
  {
    driver: "norris",
    team: "mclaren",
  },
  {
    driver: "piastri",
    team: "mclaren",
  },
  {
    driver: "bortoleto",
    team: "sauber",
  },
  {
    driver: "hulkenberg",
    team: "sauber",
  },
  {
    driver: "sainz",
    team: "williams",
  },
  {
    driver: "albon",
    team: "williams",
  },
  {
    driver: "alonso",
    team: "aston_martin",
  },
  {
    driver: "stroll",
    team: "aston_martin",
  },
  {
    driver: "ocon",
    team: "haas",
  },
  {
    driver: "bearman",
    team: "haas",
  },
  {
    driver: "doohan",
    team: "alpine",
  },
  {
    driver: "gasly",
    team: "alpine",
  },
  {
    driver: "tsunoda",
    team: "rb",
  },
  {
    driver: "hadjar",
    team: "rb",
  },
]

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

export const formatTeam = (team, driver = null) => {
  let teamId
  // Find the driver in the grid array
  if (driver) {
    // Handle driver exceptions
    const formattedDriver = exceptions.includes(driver)
      ? driver.replace(" ", "_")
      : driver

    // Find the driver in the grid array
    const driverEntry = grid.find((entry) => entry.driver === formattedDriver)

    // If a matching driver is found, use their team; otherwise, proceed with normal logic
    if (driverEntry) {
      return (teamId = driverEntry.team)
    }
  }

  // Default logic if driver is not provided or not found in the grid
  if (teamExceptions.includes(team)) {
    return (teamId = team.replace(" ", "_"))
  } else {
    return (teamId = team.split(" ").pop())
  }
}
