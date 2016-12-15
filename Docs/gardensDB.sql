CREATE DATABASE  IF NOT EXISTS `gardens` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `gardens`;
-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 192.168.1.23    Database: gardens
-- ------------------------------------------------------
-- Server version	5.7.15-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `gardentbl`
--

DROP TABLE IF EXISTS `gardentbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gardentbl` (
  `userName` varchar(45) NOT NULL,
  `gardenName` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userName`,`gardenName`),
  CONSTRAINT `login_to_garden` FOREIGN KEY (`userName`) REFERENCES `logintable` (`userName`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logintable`
--

DROP TABLE IF EXISTS `logintable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logintable` (
  `userName` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `configText` longtext,
  `configTime` datetime DEFAULT NULL,
  PRIMARY KEY (`userName`),
  UNIQUE KEY `userName_UNIQUE` (`userName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `readings`
--

DROP TABLE IF EXISTS `readings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `readings` (
  `sensorOwner` varchar(45) NOT NULL,
  `sensorName` varchar(45) NOT NULL,
  `timeStamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `temp` double DEFAULT NULL,
  `humidity` double DEFAULT NULL,
  `moisture` int(11) DEFAULT NULL,
  PRIMARY KEY (`sensorOwner`,`sensorName`,`timeStamp`),
  CONSTRAINT `sensor_to_readings` FOREIGN KEY (`sensorOwner`, `sensorName`) REFERENCES `sensorstable` (`owner`, `sensorName`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`491user`@`%`*/ /*!50003 TRIGGER `gardens`.`third_row_DELETE`
BEFORE INSERT ON `gardens`.`readings` 
for each row
BEGIN
	SET @rows = (SELECT COUNT(timeStamp) FROM `gardens`.`readings` WHERE timeStamp LIKE CONCAT(SUBSTRING(current_timestamp(),1,10),'%') AND `sensorName` = NEW.sensorName AND `sensorOwner` = NEW.sensorOwner);

	IF @rows > 2 THEN
		SET @oldest = (SELECT MIN(timeStamp) FROM gardens.readings WHERE timeStamp LIKE CONCAT(SUBSTRING(current_timestamp(),1,10),'%') AND sensorName = NEW.sensorName AND sensorOwner = NEW.sensorOwner);
		INSERT INTO `gardens`.`deleted_readings` (`sensorOwner`, `sensorName`, `timeStamp`, `temp`, `humidity`, `moisture`) SELECT `sensorOwner`, `sensorName`, `timeStamp`, `temp`, `humidity`, `moisture` FROM `gardens`.`readings` WHERE `sensorName` = NEW.sensorName AND `sensorOwner` = NEW.sensorOwner AND timeStamp = @oldest;
		#INSERT INTO `gardens`.`readings` (`sensorOwner`, `sensorName`, `temp`, `humidity`) VALUES (NEW.testUser, NEW.Sensor1, NEW.temp, NEW.humidity);
		DELETE FROM `gardens`.`readings` WHERE `sensorName` = NEW.sensorName AND `sensorOwner` = NEW.sensorOwner AND timeStamp = @oldest; 
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`491user`@`%`*/ /*!50003 TRIGGER check_trigger
  BEFORE INSERT
  ON gardens.readings
  FOR EACH ROW
BEGIN
  IF NEW.humidity < 0 OR NEW.humidity > 100 or New.moisture < 0 or New.moisture > 1023 THEN
    CALL `Error: Wrong values for readings`; -- this trick will throw an error
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `sensorstable`
--

DROP TABLE IF EXISTS `sensorstable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensorstable` (
  `owner` varchar(45) NOT NULL,
  `sensorName` varchar(45) NOT NULL,
  `sensorDesc` longtext,
  `sensorID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `gardenName` varchar(45) NOT NULL,
  PRIMARY KEY (`owner`,`sensorName`,`gardenName`),
  KEY `sensorID` (`sensorID`),
  KEY `garden_to_sensor_idx` (`owner`,`gardenName`),
  CONSTRAINT `garden_to_sensor` FOREIGN KEY (`owner`, `gardenName`) REFERENCES `gardentbl` (`userName`, `gardenName`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1082 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'gardens'
--

--
-- Dumping routines for database 'gardens'
--
/*!50003 DROP FUNCTION IF EXISTS `function1` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`491user`@`%` FUNCTION `function1`() RETURNS int(11)
BEGIN
INSERT INTO `gardens`.`readings` (`sensorOwner`, `sensorName`,`timestamp`, `temp`, `humidity`, `moisture`) VALUES ('testUser', 'Sensor0','2016-09-28-11:11:11', '99', '99', '99');
INSERT INTO `gardens`.`readings` (`sensorOwner`, `sensorName`,`timestamp`, `temp`, `humidity`, `moisture`) VALUES ('testUser', 'Sensor0','2016-09-28-11:12:11', '99', '99', '99');
INSERT INTO `gardens`.`readings` (`sensorOwner`, `sensorName`,`timestamp`, `temp`, `humidity`, `moisture`) VALUES ('testUser', 'Sensor0','2016-09-28-11:12:30', '99', '99', '99');

RETURN 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-12-14 20:47:16
