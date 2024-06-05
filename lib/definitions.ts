export type EndpointType = {
  url: string
  title: string
  description: string
  params: string
  example: number
}

export type FaqType = {
  question: string
  answer: string
}

export type TermType = {
  title: string
  description: string
}

export interface Circuit {
  circuitId: string
  circuitName: string
  country: string
  city: string
  circuitLength: string
  lapRecord: string
  firstParticipationYear: number
  corners: number
  fastestLapDriverId: string
  fastestLapTeamId: string
  fastestLapYear: number
  url: string
}

export interface Driver {
  driverId: string
  name: string
  surname: string
  country: string
  birthday: string
  number: number
  shortName: string
  url: string
}

export type Drivers = Driver[]

export interface Team {
  Team_ID: string
  Team_Name: string
  Team_Nationality: string
  First_Appareance: number
  Constructors_Championships?: number
  Drivers_Championships?: number
  URL: string
}

export type Teams = Team[]
export interface ProcessedTeam {
  teamId: string
  teamName: string
  country: string
  firstAppareance: number
  constructorsChampionships?: number
  driversChampionships?: number
  url: string
}

export type ProcessedTeams = ProcessedTeam[]

export interface Race {
  raceId: string
  championshipId: string
  raceName: string
  RaceDate: string
  circuit: Circuit
  laps: number
  winner: Driver
  teamWinner: Team
  url: string
  round: number
  raceTime: string
  qualyDate: string
  qualyTime: string
  fp1Date: string
  fp1Time: string
  fp2Date?: string
  fp2Time?: string
  fp3Date?: string
  fp3Time?: string
  sprintRaceDate?: string
  sprintRaceTime?: string
  sprintQualyDate?: string
  sprintQualyTime?: string
}

export type Races = Race[]

export interface Championship {
  championshipId: string
  championshipName: string
  url: string
  year: number
}

export type Championships = Championship[]
