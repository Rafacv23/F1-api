export type EndpointType = {
  url: string
  title: string
  description: string
  params: string
  example: number
}

export type ProcessedFastLap = {
  fast_lap: string
  fast_lap_driver_id: string
  fast_lap_team_id: string
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
  Circuit_ID: string
  Circuit_Name: string
  Country: string
  City: string
  Circuit_Length: string
  Lap_Record: string
  First_Participation_Year: number
  Number_of_Corners: number
  Fastest_Lap_Driver_ID: string
  Fastest_Lap_Team_ID: string
  Fastest_Lap_Year: number
  Url: string
}

export type Circuits = Circuit[]

export interface ProcessedCircuit {
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

export type ProcessedCircuits = ProcessedCircuit[]

export interface Driver {
  Driver_ID: string
  Name: string
  Surname: string
  Nationality: string
  Birthday: string
  Number?: number
  Short_Name: string
  URL: string
}

export type Drivers = Driver[]

export interface ProcessedDriver {
  driverId: string
  name: string
  surname: string
  country: string
  birthday: string
  number?: number
  shortName: string
  url: string
}

export type ProcessedDrivers = ProcessedDriver[]

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

export interface ProcessedRace {
  Race_ID: string
  Championship_ID: string
  Race_Name: string
  Race_Date: string
  Circuit: string
  Laps: number
  Winner_ID: string
  Team_Winner_ID: string
  Url: string
  Round: number
  Race_Time: string
  Qualy_Date: string
  Qualy_Time: string
  FP1_Date: string
  FP1_Time: string
  FP2_Date?: string
  FP2_Time?: string
  FP3_Date?: string
  FP3_Time?: string
  Sprint_Race_Date?: string
  Sprint_Race_Time?: string
  Sprint_Qualy_Date?: string
  Sprint_Qualy_Time?: string
  circuit?: Circuit
}

export type ProcessedRaces = ProcessedRace[]

export interface Championship {
  Championship_ID: string
  Championship_Name: string
  Url: string
  Year: number
}

export type Championships = Championship[]

export interface ProcessedChampionship {
  championshipId: string
  championshipName: string
  url: string
  year: number
}

export type ProcessedChampionships = ProcessedChampionship[]

export interface BaseApiResponse {
  api: string
  url: string
  limit: string | number
  total?: number
}

export interface DriverChampionship {
  classificationId: string
  championshipId: string
  driverId: string
  teamId: string
  points: number
  position: number
  wins: number
  driver: Driver
  team: Team
}

export interface ConstructorsChampionship {
  classificationId: string
  championshipId: string
  teamId: string
  points: number
  position: number
  wins: number
  team: Team
}
