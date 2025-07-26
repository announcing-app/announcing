CREATE TABLE `announcements` (
	`channelID` text NOT NULL,
	`userID` text NOT NULL,
	`announcementID` text NOT NULL,
	`headerImage` text,
	`title` text,
	`body` text NOT NULL,
	`images` text,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	PRIMARY KEY(`channelID`, `announcementID`),
	FOREIGN KEY (`channelID`) REFERENCES `channels`(`channelID`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "channelID" CHECK(octet_length("announcements"."channelID") BETWEEN 1 AND 8),
	CONSTRAINT "userID" CHECK(octet_length("announcements"."userID") BETWEEN 1 AND 256),
	CONSTRAINT "announcementID" CHECK(octet_length("announcements"."announcementID") BETWEEN 1 AND 10),
	CONSTRAINT "headerImage" CHECK("announcements"."headerImage" IS NULL OR octet_length("announcements"."headerImage") <= 100),
	CONSTRAINT "title" CHECK("announcements"."title" IS NULL OR octet_length("announcements"."title") <= 200),
	CONSTRAINT "body" CHECK(octet_length("announcements"."body") BETWEEN 1 AND 2000),
	CONSTRAINT "images" CHECK("announcements"."images" IS NULL OR json_type("announcements"."images") = 'array')
);
--> statement-breakpoint
CREATE TABLE `channels` (
	`channelID` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`desc` text,
	`icon` text,
	`announcementIDs` text,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	CONSTRAINT "channelID" CHECK(octet_length("channels"."channelID") BETWEEN 1 AND 8),
	CONSTRAINT "name" CHECK(octet_length("channels"."name") BETWEEN 1 AND 150),
	CONSTRAINT "desc" CHECK("channels"."desc" IS NULL OR octet_length("channels"."desc") <= 1000),
	CONSTRAINT "icon" CHECK("channels"."icon" IS NULL OR octet_length("channels"."icon") <= 1000000),
	CONSTRAINT "announcementIDs" CHECK("channels"."announcementIDs" IS NULL OR json_type("channels"."announcementIDs") = 'array')
);
--> statement-breakpoint
CREATE TABLE `owners` (
	`channelID` text NOT NULL,
	`userID` text NOT NULL,
	`createdAt` integer NOT NULL,
	PRIMARY KEY(`channelID`, `userID`),
	FOREIGN KEY (`channelID`) REFERENCES `channels`(`channelID`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "channelID" CHECK(octet_length("owners"."channelID") BETWEEN 1 AND 8),
	CONSTRAINT "userID" CHECK(octet_length("owners"."userID") BETWEEN 1 AND 256)
);
