CREATE TABLE `tags` (
	`tag` text NOT NULL,
	`sub` integer NOT NULL,
	`tokens` text NOT NULL,
	`count` integer NOT NULL,
	`tail` integer NOT NULL,
	PRIMARY KEY(`tag`, `sub`)
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`token` text PRIMARY KEY NOT NULL,
	`tags` text NOT NULL
);
