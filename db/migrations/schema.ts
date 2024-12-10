import { sqliteTable, AnySQLiteColumn, integer, numeric, foreignKey, real, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const championships = sqliteTable("Championships", {
	championshipId: text("Championship_ID", { length: 100 }).primaryKey(),
	championshipName: text("Championship_Name", { length: 255 }),
	url: text("Url", { length: 400 }),
	year: integer("Year"),
});

export const teams = sqliteTable("Teams", {
	teamId: text("Team_ID", { length: 200 }).primaryKey(),
	teamName: text("Team_Name", { length: 255 }),
	teamNationality: text("Team_Nationality", { length: 100 }),
	firstAppeareance: integer("First_Appeareance"),
	constructorsChampionships: integer("Constructors_Championships"),
	driversChampionships: integer("Drivers_Championships"),
	url: text("URL", { length: 400 }),
});

export const drivers = sqliteTable("Drivers", {
	driverId: text("Driver_ID", { length: 200 }).primaryKey(),
	name: text("Name", { length: 50 }).notNull(),
	surname: text("Surname", { length: 200 }).notNull(),
	nationality: text("Nationality", { length: 100 }).notNull(),
	birthday: numeric("Birthday").notNull(),
	number: integer("Number"),
	shortName: text("Short_Name", { length: 3 }),
	url: text("URL", { length: 400 }),
});

export const driverClassifications = sqliteTable("Driver_Classifications", {
	classificationId: integer("Classification_ID").primaryKey(),
	championshipId: text("Championship_ID", { length: 200 }).references(() => championships.championshipId),
	driverId: text("Driver_ID", { length: 200 }).references(() => drivers.driverId),
	teamId: text("Team_ID", { length: 255 }).references(() => teams.teamId),
	points: real("Points"),
	position: integer("Position"),
	wins: integer(),
});

export const constructorsClassifications = sqliteTable("Constructors_Classifications", {
	classificationId: integer("Classification_ID").primaryKey(),
	championshipId: text("Championship_ID", { length: 200 }).references(() => championships.championshipId),
	teamId: text("Team_ID", { length: 255 }).references(() => teams.teamId),
	points: real("Points"),
	position: integer("Position"),
	wins: integer(),
});

export const circuits = sqliteTable("Circuits", {
	circuitId: text("Circuit_ID", { length: 100 }).primaryKey(),
	circuitName: text("Circuit_Name", { length: 255 }),
	country: text("Country", { length: 100 }),
	city: text("City", { length: 100 }),
	circuitLength: real("Circuit_Length"),
	lapRecord: numeric("Lap_Record"),
	firstParticipationYear: integer("First_Participation_Year"),
	numberOfCorners: integer("Number_of_Corners"),
	fastestLapDriverId: text("Fastest_Lap_Driver_ID", { length: 200 }).references(() => drivers.driverId),
	fastestLapTeamId: text("Fastest_Lap_Team_ID", { length: 255 }).references(() => teams.teamId),
	fastestLapYear: integer("Fastest_Lap_Year"),
	url: text("Url", { length: 400 }),
});

export const classifications = sqliteTable("Classifications", {
	classificationId: integer("Classification_ID").primaryKey(),
	raceId: text("Race_ID", { length: 200 }).references(() => races.raceId),
	driverId: text("Driver_ID", { length: 200 }).references(() => drivers.driverId),
	teamId: text("Team_ID", { length: 255 }).references(() => teams.teamId),
	q1: numeric("Q1"),
	q2: numeric("Q2"),
	q3: numeric("Q3"),
	gridPosition: integer("Grid_Position"),
});

export const races = sqliteTable("Races", {
	raceId: text("Race_ID", { length: 200 }).primaryKey(),
	championshipId: text("Championship_ID", { length: 100 }).references(() => championships.championshipId),
	raceName: text("Race_Name", { length: 255 }),
	raceDate: numeric("Race_Date"),
	circuit: text("Circuit", { length: 255 }),
	laps: integer("Laps"),
	winnerId: text("Winner_ID", { length: 200 }).references(() => drivers.driverId),
	teamWinnerId: text("Team_Winner_ID", { length: 255 }).references(() => teams.teamId),
	url: text("Url", { length: 400 }),
	round: integer("Round"),
	raceTime: numeric("Race_Time"),
	qualyDate: numeric("Qualy_Date"),
	fp1Date: numeric("FP1_Date"),
	fp2Date: numeric("FP2_Date"),
	fp3Date: numeric("FP3_Date"),
	sprintQualyDate: numeric("Sprint_Qualy_Date"),
	sprintRaceDate: numeric("Sprint_Race_Date"),
	qualyTime: text("Qualy_Time", { length: 8 }),
	fp1Time: text("FP1_Time", { length: 8 }),
	fp2Time: text("FP2_Time", { length: 8 }),
	fp3Time: text("FP3_Time", { length: 8 }),
	sprintQualyTime: text("Sprint_Qualy_Time", { length: 8 }),
	sprintRaceTime: text("Sprint_Race_Time", { length: 8 }),
	fastLap: text("fast_lap", { length: 200 }),
	fastLapDriverId: text("fast_lap_driver_id", { length: 200 }),
	fastLapTeamId: text("fast_lap_team_id", { length: 200 }),
});

export const results = sqliteTable("Results", {
	resultId: integer("Result_ID").primaryKey(),
	raceId: text("Race_ID", { length: 200 }).references(() => races.raceId),
	driverId: text("Driver_ID", { length: 200 }).references(() => drivers.driverId),
	teamId: text("Team_ID", { length: 255 }).references(() => teams.teamId),
	finishingPosition: integer("Finishing_Position"),
	gridPosition: integer("Grid_Position"),
	raceTime: text("Race_Time", { length: 50 }),
	retired: text("Retired", { length: 100 }),
	pointsObtained: real("Points_Obtained"),
	fastLap: text("fast_lap"),
});

export const sprintQualy = sqliteTable("Sprint_Qualy", {
	sprintQualyId: integer("Sprint_Qualy_ID").primaryKey(),
	raceId: text("Race_ID", { length: 200 }).references(() => races.raceId),
	driverId: text("Driver_ID", { length: 200 }).references(() => drivers.driverId),
	teamId: text("Team_ID", { length: 255 }).references(() => teams.teamId),
	sq1: numeric("SQ1"),
	sq2: numeric("SQ2"),
	sq3: numeric("SQ3"),
	gridPosition: integer("Grid_Position"),
});

export const sprintRace = sqliteTable("Sprint_Race", {
	sprintRaceId: integer("Sprint_Race_ID").primaryKey(),
	raceId: text("Race_ID", { length: 200 }).references(() => races.raceId),
	driverId: text("Driver_ID", { length: 200 }).references(() => drivers.driverId),
	teamId: text("Team_ID", { length: 255 }).references(() => teams.teamId),
	finishingPosition: integer("Finishing_Position"),
	gridPosition: integer("Grid_Position"),
	laps: integer("Laps"),
	raceTime: text("Race_Time", { length: 50 }),
	retired: text("Retired", { length: 100 }),
	pointsObtained: real("Points_Obtained"),
});

export const fp1 = sqliteTable("FP1", {
	fp1Id: integer("FP1_ID").primaryKey(),
	raceId: text("Race_ID", { length: 200 }).references(() => races.raceId),
	driverId: text("Driver_ID", { length: 200 }).references(() => drivers.driverId),
	teamId: text("Team_ID", { length: 255 }).references(() => teams.teamId),
	time: numeric("Time"),
});

export const fp3 = sqliteTable("FP3", {
	fp3Id: integer("FP3_ID").primaryKey(),
	raceId: text("Race_ID", { length: 200 }).references(() => races.raceId),
	driverId: text("Driver_ID", { length: 200 }).references(() => drivers.driverId),
	teamId: text("Team_ID", { length: 255 }).references(() => teams.teamId),
	time: numeric("Time"),
});

export const fp2 = sqliteTable("FP2", {
	fp2Id: integer("FP2_ID").primaryKey(),
	raceId: text("Race_ID", { length: 200 }).references(() => races.raceId),
	driverId: text("Driver_ID", { length: 200 }).references(() => drivers.driverId),
	teamId: text("Team_ID", { length: 255 }).references(() => teams.teamId),
	time: numeric("Time"),
});

