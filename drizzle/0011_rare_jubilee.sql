CREATE TABLE `tierlist_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`week` varchar(10) NOT NULL,
	`scenario` varchar(40) NOT NULL,
	`classKey` varchar(40) NOT NULL,
	`tier` varchar(2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tierlist_history_id` PRIMARY KEY(`id`),
	CONSTRAINT `week_scenario_class` UNIQUE(`week`,`scenario`,`classKey`)
);
--> statement-breakpoint
CREATE TABLE `tierlist_votes_spirit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`scenario` varchar(40) NOT NULL,
	`spiritKey` varchar(60) NOT NULL,
	`vote` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tierlist_votes_spirit_id` PRIMARY KEY(`id`),
	CONSTRAINT `userId_scenario_spirit` UNIQUE(`userId`,`scenario`,`spiritKey`)
);
