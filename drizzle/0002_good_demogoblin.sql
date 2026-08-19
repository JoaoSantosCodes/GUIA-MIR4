CREATE TABLE `farm_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`farmKey` varchar(120) NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `farm_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `favorites` MODIFY COLUMN `itemType` enum('spirit','codex','farm','class','economy','boss') NOT NULL;--> statement-breakpoint
CREATE INDEX `farmKey_idx` ON `farm_comments` (`farmKey`);