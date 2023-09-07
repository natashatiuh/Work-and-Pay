CREATE TABLE `orders` (
  `id` varchar(255) NOT NULL,
  `orderName` varchar(255) NOT NULL,
  `authorId` varchar(255) NOT NULL,
  `dateOfPublishing` datetime DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `state` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_281b5c7415372d49c199a0f33b0` (`authorId`),
  CONSTRAINT `FK_281b5c7415372d49c199a0f33b0` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`)
)
