CREATE TABLE `requests` (
  `id` varchar(255) NOT NULL,
  `orderId` varchar(255) NOT NULL,
  `executorId` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_909b7197ddb6dcc556f621c6766` (`orderId`),
  CONSTRAINT `FK_909b7197ddb6dcc556f621c6766` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`)
)
