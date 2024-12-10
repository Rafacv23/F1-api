import { relations } from "drizzle-orm/relations";
import { drivers, driverClassifications, teams, championships, constructorsClassifications, circuits, classifications, races, results, sprintQualy, sprintRace, fp1, fp3, fp2 } from "./schema";

export const driverClassificationsRelations = relations(driverClassifications, ({one}) => ({
	driver: one(drivers, {
		fields: [driverClassifications.driverId],
		references: [drivers.driverId]
	}),
	team: one(teams, {
		fields: [driverClassifications.teamId],
		references: [teams.teamId]
	}),
	championship: one(championships, {
		fields: [driverClassifications.championshipId],
		references: [championships.championshipId]
	}),
}));

export const driversRelations = relations(drivers, ({many}) => ({
	driverClassifications: many(driverClassifications),
	circuits: many(circuits),
	classifications: many(classifications),
	races: many(races),
	results: many(results),
	sprintQualies: many(sprintQualy),
	sprintRaces: many(sprintRace),
	fp1s: many(fp1),
	fp3s: many(fp3),
	fp2s: many(fp2),
}));

export const teamsRelations = relations(teams, ({many}) => ({
	driverClassifications: many(driverClassifications),
	constructorsClassifications: many(constructorsClassifications),
	circuits: many(circuits),
	classifications: many(classifications),
	races: many(races),
	results: many(results),
	sprintQualies: many(sprintQualy),
	sprintRaces: many(sprintRace),
	fp1s: many(fp1),
	fp3s: many(fp3),
	fp2s: many(fp2),
}));

export const championshipsRelations = relations(championships, ({many}) => ({
	driverClassifications: many(driverClassifications),
	constructorsClassifications: many(constructorsClassifications),
	races: many(races),
}));

export const constructorsClassificationsRelations = relations(constructorsClassifications, ({one}) => ({
	team: one(teams, {
		fields: [constructorsClassifications.teamId],
		references: [teams.teamId]
	}),
	championship: one(championships, {
		fields: [constructorsClassifications.championshipId],
		references: [championships.championshipId]
	}),
}));

export const circuitsRelations = relations(circuits, ({one}) => ({
	driver: one(drivers, {
		fields: [circuits.fastestLapDriverId],
		references: [drivers.driverId]
	}),
	team: one(teams, {
		fields: [circuits.fastestLapTeamId],
		references: [teams.teamId]
	}),
}));

export const classificationsRelations = relations(classifications, ({one}) => ({
	driver: one(drivers, {
		fields: [classifications.driverId],
		references: [drivers.driverId]
	}),
	team: one(teams, {
		fields: [classifications.teamId],
		references: [teams.teamId]
	}),
	race: one(races, {
		fields: [classifications.raceId],
		references: [races.raceId]
	}),
}));

export const racesRelations = relations(races, ({one, many}) => ({
	classifications: many(classifications),
	driver: one(drivers, {
		fields: [races.winnerId],
		references: [drivers.driverId]
	}),
	team: one(teams, {
		fields: [races.teamWinnerId],
		references: [teams.teamId]
	}),
	championship: one(championships, {
		fields: [races.championshipId],
		references: [championships.championshipId]
	}),
	results: many(results),
	sprintQualies: many(sprintQualy),
	sprintRaces: many(sprintRace),
	fp1s: many(fp1),
	fp3s: many(fp3),
	fp2s: many(fp2),
}));

export const resultsRelations = relations(results, ({one}) => ({
	team: one(teams, {
		fields: [results.teamId],
		references: [teams.teamId]
	}),
	driver: one(drivers, {
		fields: [results.driverId],
		references: [drivers.driverId]
	}),
	race: one(races, {
		fields: [results.raceId],
		references: [races.raceId]
	}),
}));

export const sprintQualyRelations = relations(sprintQualy, ({one}) => ({
	driver: one(drivers, {
		fields: [sprintQualy.driverId],
		references: [drivers.driverId]
	}),
	team: one(teams, {
		fields: [sprintQualy.teamId],
		references: [teams.teamId]
	}),
	race: one(races, {
		fields: [sprintQualy.raceId],
		references: [races.raceId]
	}),
}));

export const sprintRaceRelations = relations(sprintRace, ({one}) => ({
	team: one(teams, {
		fields: [sprintRace.teamId],
		references: [teams.teamId]
	}),
	driver: one(drivers, {
		fields: [sprintRace.driverId],
		references: [drivers.driverId]
	}),
	race: one(races, {
		fields: [sprintRace.raceId],
		references: [races.raceId]
	}),
}));

export const fp1Relations = relations(fp1, ({one}) => ({
	driver: one(drivers, {
		fields: [fp1.driverId],
		references: [drivers.driverId]
	}),
	team: one(teams, {
		fields: [fp1.teamId],
		references: [teams.teamId]
	}),
	race: one(races, {
		fields: [fp1.raceId],
		references: [races.raceId]
	}),
}));

export const fp3Relations = relations(fp3, ({one}) => ({
	driver: one(drivers, {
		fields: [fp3.driverId],
		references: [drivers.driverId]
	}),
	team: one(teams, {
		fields: [fp3.teamId],
		references: [teams.teamId]
	}),
	race: one(races, {
		fields: [fp3.raceId],
		references: [races.raceId]
	}),
}));

export const fp2Relations = relations(fp2, ({one}) => ({
	driver: one(drivers, {
		fields: [fp2.driverId],
		references: [drivers.driverId]
	}),
	team: one(teams, {
		fields: [fp2.teamId],
		references: [teams.teamId]
	}),
	race: one(races, {
		fields: [fp2.raceId],
		references: [races.raceId]
	}),
}));