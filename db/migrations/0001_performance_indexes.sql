-- Performance indexes for high-traffic API filters/orderings.
-- Safe to run multiple times.

CREATE INDEX IF NOT EXISTS idx_championships_year
  ON Championships(Year);

CREATE INDEX IF NOT EXISTS idx_races_championship_round
  ON Races(Championship_ID, Round);

CREATE INDEX IF NOT EXISTS idx_races_championship_race_date
  ON Races(Championship_ID, Race_Date DESC);

CREATE INDEX IF NOT EXISTS idx_races_championship_qualy_date
  ON Races(Championship_ID, Qualy_Date DESC);

CREATE INDEX IF NOT EXISTS idx_races_championship_sprint_qualy_date
  ON Races(Championship_ID, Sprint_Qualy_Date DESC);

CREATE INDEX IF NOT EXISTS idx_races_championship_sprint_race_date
  ON Races(Championship_ID, Sprint_Race_Date DESC);

CREATE INDEX IF NOT EXISTS idx_results_race_finishing_position
  ON Results(Race_ID, Finishing_Position);

CREATE INDEX IF NOT EXISTS idx_results_driver_race
  ON Results(Driver_ID, Race_ID);

CREATE INDEX IF NOT EXISTS idx_driver_classifications_championship_position
  ON Driver_Classifications(Championship_ID, Position);

CREATE INDEX IF NOT EXISTS idx_driver_classifications_championship_team
  ON Driver_Classifications(Championship_ID, Team_ID);

CREATE INDEX IF NOT EXISTS idx_constructors_classifications_championship_position
  ON Constructors_Classifications(Championship_ID, Position);

CREATE INDEX IF NOT EXISTS idx_classifications_race_grid
  ON Classifications(Race_ID, Grid_Position);

CREATE INDEX IF NOT EXISTS idx_sprint_race_race_finishing_position
  ON Sprint_Race(Race_ID, Finishing_Position);

CREATE INDEX IF NOT EXISTS idx_sprint_qualy_race_grid
  ON Sprint_Qualy(Race_ID, Grid_Position);

CREATE INDEX IF NOT EXISTS idx_fp1_race_time
  ON FP1(Race_ID, Time);

CREATE INDEX IF NOT EXISTS idx_fp2_race_time
  ON FP2(Race_ID, Time);

CREATE INDEX IF NOT EXISTS idx_fp3_race_time
  ON FP3(Race_ID, Time);
