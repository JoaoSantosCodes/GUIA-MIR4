CREATE TABLE `tierlist_history_spirit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`week` varchar(10) NOT NULL,
	`scenario` varchar(40) NOT NULL,
	`spiritKey` varchar(60) NOT NULL,
	`tier` varchar(2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tierlist_history_spirit_id` PRIMARY KEY(`id`),
	CONSTRAINT `week_scenario_spirit` UNIQUE(`week`,`scenario`,`spiritKey`)
);
