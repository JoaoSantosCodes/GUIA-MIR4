CREATE TABLE `comment_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`commentId` int NOT NULL,
	`vote` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comment_votes_id` PRIMARY KEY(`id`),
	CONSTRAINT `userId_commentId` UNIQUE(`userId`,`commentId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `soundAlerts` int DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `commentId_idx` ON `comment_votes` (`commentId`);