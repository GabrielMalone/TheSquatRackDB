-- MySQL dump 10.13  Distrib 8.0.37, for macos14 (arm64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Exercise`
--

DROP TABLE IF EXISTS `Exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Exercise` (
  `idExercise` int NOT NULL AUTO_INCREMENT,
  `ExerciseName` varchar(45) DEFAULT NULL,
  `abbreviation` varchar(10) DEFAULT NULL,
  `ExerciseCategory` varchar(45) DEFAULT NULL,
  `ExerciseDescription` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idExercise`),
  UNIQUE KEY `idExercise_UNIQUE` (`idExercise`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Exercise`
--

LOCK TABLES `Exercise` WRITE;
/*!40000 ALTER TABLE `Exercise` DISABLE KEYS */;
INSERT INTO `Exercise` VALUES (1,'Low-Bar-Squat','LB_Squat','squat','Barbell placement atop rear delts'),(2,'High-Bar-Squat','HB_Squat','squat','Barbell placement atop traps'),(3,'Front-Squat','Fr_Squat','squat','Barbell placement along front delts'),(4,'SSB-Squat','SSB','squat','Barbell squat with the Safety Squat Bar'),(5,'Competition-Grip-Bench-Press','C_Bench','bench','Bench press perfomed with competition grip width'),(6,'Close-Grip-Bench','CG_Bench','bench','Bench press performed with grip closer than competition grip'),(7,'Board-Press','BoardPress','bench','Bench press performed with reduced ROM'),(8,'Over-Head-Press','OHP','bench','Barbell pressed overhead, performed while standing'),(9,'Conventional-Deadlift','Deadlift','deadlift','Deadlift performed with grip ouside of legs'),(10,'Sumo-Deadlift','Sumo','deadlift','Deadlift performed with grip ouside of legs'),(11,'Deficit-Conventional-Deadlift','Def_Deads','deadlift','Deadlift performed with greater ROM than from the floor'),(12,'Deficit-Sumo-Deadlift','Def_Deads','deadlift','Deadlift performed with greater ROM than from the floor'),(13,'Romanian-Deadlift','Romanians','deadlift','Convetional Deadlift performed with only a slight bend in the knees'),(14,'Bicep-Curls-barbell','BB_Curls','accessory','curls done with an olympic barbell'),(15,'Bulgarian-Split-Squats','Bulgarians','accessory','The thing you do not like to do'),(16,'Pull-ups-wide-grip','pullups','accessory','pull-ups done with hands farther apart than medium grip pull-ups'),(17,'Pull-ups-medium-grip','pullups','accessory','pull-ups done with hands closer togther than wide grip pull-ups');
/*!40000 ALTER TABLE `Exercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ExerciseOrderInWorkout`
--

DROP TABLE IF EXISTS `ExerciseOrderInWorkout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ExerciseOrderInWorkout` (
  `idExercise` int NOT NULL,
  `idWorkout` int NOT NULL,
  `Order` int NOT NULL,
  PRIMARY KEY (`idExercise`,`idWorkout`),
  UNIQUE KEY `idWorkout` (`idWorkout`,`Order`),
  KEY `fk_Exercise_has_Workout_Workout1_idx` (`idWorkout`),
  KEY `fk_Exercise_has_Workout_Exercise1_idx` (`idExercise`),
  CONSTRAINT `fk_Exercise_has_Workout_Exercise1` FOREIGN KEY (`idExercise`) REFERENCES `Exercise` (`idExercise`),
  CONSTRAINT `fk_Exercise_has_Workout_Workout1` FOREIGN KEY (`idWorkout`) REFERENCES `Workout` (`idWorkout`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ExerciseOrderInWorkout`
--

LOCK TABLES `ExerciseOrderInWorkout` WRITE;
/*!40000 ALTER TABLE `ExerciseOrderInWorkout` DISABLE KEYS */;
INSERT INTO `ExerciseOrderInWorkout` VALUES (2,16,3),(15,16,4);
/*!40000 ALTER TABLE `ExerciseOrderInWorkout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Set`
--

DROP TABLE IF EXISTS `Set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Set` (
  `idSet` int NOT NULL AUTO_INCREMENT,
  `SetNumber` int NOT NULL,
  `idExercise` int NOT NULL,
  `idWorkout` int NOT NULL,
  `setWeight` double NOT NULL DEFAULT '0',
  `setReps` int NOT NULL DEFAULT '0',
  `setRPE` float NOT NULL DEFAULT '0',
  `workingSet` tinyint DEFAULT '0',
  `paused` tinyint DEFAULT '0',
  `belt` tinyint DEFAULT '0',
  `unilateral` tinyint DEFAULT '0',
  `setComment` blob,
  `setVideo` varchar(45) DEFAULT NULL,
  `isPR` tinyint DEFAULT '0',
  PRIMARY KEY (`idSet`),
  UNIQUE KEY `idSet_UNIQUE` (`idSet`),
  UNIQUE KEY `unique_set_per_exercise` (`idWorkout`,`idExercise`,`SetNumber`),
  KEY `fk_Set_Exercise1_idx` (`idExercise`),
  KEY `fk_Set_Workout1_idx` (`idWorkout`),
  CONSTRAINT `fk_Set_Exercise1` FOREIGN KEY (`idExercise`) REFERENCES `Exercise` (`idExercise`),
  CONSTRAINT `fk_Set_Workout1` FOREIGN KEY (`idWorkout`) REFERENCES `Workout` (`idWorkout`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Set`
--

LOCK TABLES `Set` WRITE;
/*!40000 ALTER TABLE `Set` DISABLE KEYS */;
INSERT INTO `Set` VALUES (71,1,2,16,95,2,1,0,1,0,0,NULL,NULL,0),(72,2,2,16,135,2,1,0,1,0,0,NULL,NULL,0),(73,3,2,16,185,2,1,0,1,0,0,NULL,NULL,0),(74,4,2,16,225,2,1,0,1,0,0,NULL,NULL,0),(75,5,2,16,275,1,1,0,1,0,0,NULL,NULL,0),(76,6,2,16,315,1,1,0,1,1,0,NULL,NULL,0),(77,7,2,16,315,1,1,0,1,1,0,NULL,NULL,0),(78,8,2,16,365,1,1,0,1,1,0,NULL,NULL,0),(79,9,2,16,405,1,5,0,1,1,0,NULL,NULL,0),(80,10,2,16,440,2,8.5,1,1,1,0,NULL,NULL,0),(81,11,2,16,225,3,1,0,1,0,0,NULL,NULL,0),(82,12,2,16,315,10,6,1,1,0,0,NULL,NULL,0),(83,1,15,16,1,20,1,1,0,0,1,NULL,NULL,0),(84,2,15,16,1,20,1,1,0,0,1,NULL,NULL,0),(85,3,15,16,80,10,9.5,1,0,0,1,NULL,NULL,0),(86,4,15,16,80,10,10,1,0,0,1,NULL,NULL,0);
/*!40000 ALTER TABLE `Set` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) NOT NULL,
  `userFirst` varchar(45) DEFAULT NULL,
  `userLast` varchar(45) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `userName_UNIQUE` (`userName`),
  UNIQUE KEY `idUser_UNIQUE` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (9,'Gabe',NULL,NULL,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Workout`
--

DROP TABLE IF EXISTS `Workout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Workout` (
  `idWorkout` int NOT NULL AUTO_INCREMENT,
  `Date` datetime NOT NULL,
  `idUser` int NOT NULL,
  `numberOfLifts` int NOT NULL DEFAULT '1',
  `workoutTitle` varchar(255) DEFAULT NULL,
  `userWeight` int DEFAULT NULL,
  `userAge` int DEFAULT NULL,
  `fatigueRating` int DEFAULT NULL,
  `sessionNote` varchar(1500) DEFAULT NULL,
  PRIMARY KEY (`idWorkout`),
  UNIQUE KEY `idWorkout_UNIQUE` (`idWorkout`),
  UNIQUE KEY `uq_user_date` (`idUser`,`Date`),
  KEY `fk_Workout_User_idx` (`idUser`),
  CONSTRAINT `fk_Workout_User` FOREIGN KEY (`idUser`) REFERENCES `User` (`idUser`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workout`
--

LOCK TABLES `Workout` WRITE;
/*!40000 ALTER TABLE `Workout` DISABLE KEYS */;
INSERT INTO `Workout` VALUES (16,'2025-07-23 00:00:00',9,4,NULL,NULL,NULL,NULL,'10 min bike warmup.<div>belt squat warm up.&nbsp;</div><div>no sleeves.</div><div>440x2 topset felt solid.&nbsp;</div>');
/*!40000 ALTER TABLE `Workout` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-23 13:29:28
