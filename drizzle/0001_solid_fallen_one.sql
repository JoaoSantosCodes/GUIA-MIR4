CREATE TABLE `codex_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`itemId` varchar(120) NOT NULL,
	`collectedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `codex_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `userId_itemId` UNIQUE(`userId`,`itemId`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`itemId` varchar(120) NOT NULL,
	`itemType` enum('spirit','codex','farm','class','economy') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `userId_itemId` UNIQUE(`userId`,`itemId`)
);
