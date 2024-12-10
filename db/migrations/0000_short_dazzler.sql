-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `Championships` (
	`Championship_ID` text(100) PRIMARY KEY,
	`Championship_Name` text(255),
	`Url` text(400),
	`Year` integer
);
--> statement-breakpoint
CREATE TABLE `Teams` (
	`Team_ID` text(200) PRIMARY KEY,
	`Team_Name` text(255),
	`Team_Nationality` text(100),
	`First_Appeareance` integer,
	`Constructors_Championships` integer,
	`Drivers_Championships` integer,
	`URL` text(400)
);
--> statement-breakpoint
CREATE TABLE `Drivers` (
	`Driver_ID` text(200) PRIMARY KEY,
	`Name` text(50) NOT NULL,
	`Surname` text(200) NOT NULL,
	`Nationality` text(100) NOT NULL,
	`Birthday` numeric NOT NULL,
	`Number` integer,
	`Short_Name` text(3),
	`URL` text(400)
);
--> statement-breakpoint
CREATE TABLE `Driver_Classifications` (
	`Classification_ID` integer PRIMARY KEY,
	`Championship_ID` text(200),
	`Driver_ID` text(200),
	`Team_ID` text(255),
	`Points` real,
	`Position` integer,
	`wins` integer,
	FOREIGN KEY (`Driver_ID`) REFERENCES `Drivers`(`Driver_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Team_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Championship_ID`) REFERENCES `Championships`(`Championship_ID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Constructors_Classifications` (
	`Classification_ID` integer PRIMARY KEY,
	`Championship_ID` text(200),
	`Team_ID` text(255),
	`Points` real,
	`Position` integer,
	`wins` integer,
	FOREIGN KEY (`Team_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Championship_ID`) REFERENCES `Championships`(`Championship_ID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Circuits` (
	`Circuit_ID` text(100) PRIMARY KEY,
	`Circuit_Name` text(255),
	`Country` text(100),
	`City` text(100),
	`Circuit_Length` real,
	`Lap_Record` numeric,
	`First_Participation_Year` integer,
	`Number_of_Corners` integer,
	`Fastest_Lap_Driver_ID` text(200),
	`Fastest_Lap_Team_ID` text(255),
	`Fastest_Lap_Year` integer,
	`Url` text(400),
	FOREIGN KEY (`Fastest_Lap_Driver_ID`) REFERENCES `Drivers`(`Driver_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Fastest_Lap_Team_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Classifications` (
	`Classification_ID` integer PRIMARY KEY,
	`Race_ID` text(200),
	`Driver_ID` text(200),
	`Team_ID` text(255),
	`Q1` numeric,
	`Q2` numeric,
	`Q3` numeric,
	`Grid_Position` integer,
	FOREIGN KEY (`Driver_ID`) REFERENCES `Drivers`(`Driver_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Team_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Race_ID`) REFERENCES `Races`(`Race_ID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Races` (
	`Race_ID` text(200) PRIMARY KEY,
	`Championship_ID` text(100),
	`Race_Name` text(255),
	`Race_Date` numeric,
	`Circuit` text(255),
	`Laps` integer,
	`Winner_ID` text(200),
	`Team_Winner_ID` text(255),
	`Url` text(400),
	`Round` integer,
	`Race_Time` numeric,
	`Qualy_Date` numeric,
	`FP1_Date` numeric,
	`FP2_Date` numeric,
	`FP3_Date` numeric,
	`Sprint_Qualy_Date` numeric,
	`Sprint_Race_Date` numeric,
	`Qualy_Time` text(8),
	`FP1_Time` text(8),
	`FP2_Time` text(8),
	`FP3_Time` text(8),
	`Sprint_Qualy_Time` text(8),
	`Sprint_Race_Time` text(8),
	`fast_lap` text(200),
	`fast_lap_driver_id` text(200),
	`fast_lap_team_id` text(200),
	FOREIGN KEY (`Winner_ID`) REFERENCES `Drivers`(`Driver_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Team_Winner_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Championship_ID`) REFERENCES `Championships`(`Championship_ID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Results` (
	`Result_ID` integer PRIMARY KEY,
	`Race_ID` text(200),
	`Driver_ID` text(200),
	`Team_ID` text(255),
	`Finishing_Position` integer,
	`Grid_Position` integer,
	`Race_Time` text(50),
	`Retired` text(100),
	`Points_Obtained` real,
	FOREIGN KEY (`Team_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Driver_ID`) REFERENCES `Drivers`(`Driver_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Race_ID`) REFERENCES `Races`(`Race_ID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Sprint_Qualy` (
	`Sprint_Qualy_ID` integer PRIMARY KEY,
	`Race_ID` text(200),
	`Driver_ID` text(200),
	`Team_ID` text(255),
	`SQ1` numeric,
	`SQ2` numeric,
	`SQ3` numeric,
	`Grid_Position` integer,
	FOREIGN KEY (`Driver_ID`) REFERENCES `Drivers`(`Driver_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Team_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Race_ID`) REFERENCES `Races`(`Race_ID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Sprint_Race` (
	`Sprint_Race_ID` integer PRIMARY KEY,
	`Race_ID` text(200),
	`Driver_ID` text(200),
	`Team_ID` text(255),
	`Finishing_Position` integer,
	`Grid_Position` integer,
	`Laps` integer,
	`Race_Time` text(50),
	`Retired` text(100),
	`Points_Obtained` real,
	FOREIGN KEY (`Team_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Driver_ID`) REFERENCES `Drivers`(`Driver_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Race_ID`) REFERENCES `Races`(`Race_ID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `FP1` (
	`FP1_ID` integer PRIMARY KEY,
	`Race_ID` text(200),
	`Driver_ID` text(200),
	`Team_ID` text(255),
	`Time` numeric,
	FOREIGN KEY (`Driver_ID`) REFERENCES `Drivers`(`Driver_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Team_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Race_ID`) REFERENCES `Races`(`Race_ID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `FP3` (
	`FP3_ID` integer PRIMARY KEY,
	`Race_ID` text(200),
	`Driver_ID` text(200),
	`Team_ID` text(255),
	`Time` numeric,
	FOREIGN KEY (`Driver_ID`) REFERENCES `Drivers`(`Driver_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Team_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Race_ID`) REFERENCES `Races`(`Race_ID`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `FP2` (
	`FP2_ID` integer PRIMARY KEY,
	`Race_ID` text(200),
	`Driver_ID` text(200),
	`Team_ID` text(255),
	`Time` numeric,
	FOREIGN KEY (`Driver_ID`) REFERENCES `Drivers`(`Driver_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Team_ID`) REFERENCES `Teams`(`Team_ID`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Race_ID`) REFERENCES `Races`(`Race_ID`) ON UPDATE no action ON DELETE no action
);

*/