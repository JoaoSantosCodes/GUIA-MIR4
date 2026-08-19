CREATE TABLE `tierlist_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`scenario` varchar(40) NOT NULL,
	`classKey` varchar(40) NOT NULL,
	`vote` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tierlist_votes_id` PRIMARY KEY(`id`),
	CONSTRAINT `userId_scenario_class` UNIQUE(`userId`,`scenario`,`classKey`)
);
