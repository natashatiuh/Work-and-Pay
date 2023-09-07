CREATE TABLE `reviews` (
  `id` varchar(255) NOT NULL,
  `orderId` varchar(255) NOT NULL,
  `recipientId` varchar(255) NOT NULL,
  `authorId` varchar(255) NOT NULL,
  `mark` int DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_53a68dc905777554b7f702791fa` (`orderId`),
  CONSTRAINT `FK_53a68dc905777554b7f702791fa` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`)
)
