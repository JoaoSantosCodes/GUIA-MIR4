CREATE TABLE `chapter_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`chapter` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chapter_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `userId_chapter` UNIQUE(`userId`,`chapter`)
);
