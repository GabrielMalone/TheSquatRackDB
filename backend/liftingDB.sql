SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema thesquatrack
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `thesquatrack` ;

-- -----------------------------------------------------
-- Schema thesquatrack
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `thesquatrack` DEFAULT CHARACTER SET utf8 ;
USE `thesquatrack` ;

-- -----------------------------------------------------
-- Table `thesquatrack`.`User` 
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`User` ;

CREATE TABLE IF NOT EXISTS `thesquatrack`.`User` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `userName` VARCHAR(45) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `userFirst` VARCHAR(45) NULL,
  `userLast` VARCHAR(45) NULL,
  `Email` VARCHAR(45) NOT NULL,
  `dateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `profilePic` VARCHAR(255) NULL,
  `isAdmin` TINYINT NOT NULL DEFAULT 0,
  `isPublic` TINYINT NOT NULL DEFAULT 1,
  `isLoggedIn` TINYINT NOT NULL DEFAULT 0,
  `isLightMode` TINYINT NOT NULL DEFAULT 1,
  `coachedBy` INT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `userName_UNIQUE` (`userName` ASC) VISIBLE,
  UNIQUE INDEX `idUser_UNIQUE` (`idUser` ASC) VISIBLE,
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC) VISIBLE
)
ENGINE = InnoDB;

-- ----------------------------------------------------- 
-- Table `thesquatrack`.`Workout`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`Workout` ;

CREATE TABLE IF NOT EXISTS `thesquatrack`.`Workout` (
  `idWorkout` INT NOT NULL AUTO_INCREMENT,
  `Date` DATETIME NOT NULL,
  `idUser` INT NOT NULL,
  `workoutTitle` VARCHAR(255) NULL,
  `userWeight` INT NULL,
  `userAge` INT NULL,
  `fatigueRating` INT NULL,
  `sessionNote`  TEXT,
  INDEX `fk_Workout_User_idx` (`idUser` ASC) VISIBLE,
  PRIMARY KEY (`idWorkout`),
  UNIQUE INDEX `idWorkout_UNIQUE` (`idWorkout` ASC) VISIBLE,
  UNIQUE INDEX `uq_user_date` (`idUser` ASC, `Date` ASC) VISIBLE,
  CONSTRAINT `fk_Workout_User`
    FOREIGN KEY (`idUser`)
    REFERENCES `thesquatrack`.`User` (`idUser`)
    ON DELETE CASCADE  
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `thesquatrack`.`Exercise`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`Exercise` ;

CREATE TABLE IF NOT EXISTS `thesquatrack`.`Exercise` (
  `idExercise` INT NOT NULL AUTO_INCREMENT,
  `ExerciseName` VARCHAR(45) NULL,
  `abbreviation` VARCHAR(10) NULL,
  `ExerciseCategory` VARCHAR(45) NULL, -- does this exercise fall under a squat deadlift bench variation ?
  `ExerciseDescription` VARCHAR(255) NULL,
  UNIQUE INDEX `idExercise_UNIQUE` (`idExercise` ASC) VISIBLE,
  PRIMARY KEY (`idExercise`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `thesquatrack`.`ExerciseOrderInWorkout` 
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`ExerciseOrderInWorkout`;

CREATE TABLE IF NOT EXISTS `thesquatrack`.`ExerciseOrderInWorkout` (
  `idExercise` INT NOT NULL,
  `idWorkout` INT NOT NULL,
  `Order` INT NOT NULL,  
  PRIMARY KEY (`idExercise`, `idWorkout`),
  UNIQUE (`idWorkout`, `Order`), 
  INDEX `fk_Exercise_has_Workout_Workout1_idx` (`idWorkout` ASC) VISIBLE,
  INDEX `fk_Exercise_has_Workout_Exercise1_idx` (`idExercise` ASC) VISIBLE,
  CONSTRAINT `fk_Exercise_has_Workout_Exercise1`
    FOREIGN KEY (`idExercise`)
    REFERENCES `thesquatrack`.`Exercise` (`idExercise`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Exercise_has_Workout_Workout1`
    FOREIGN KEY (`idWorkout`)
    REFERENCES `thesquatrack`.`Workout` (`idWorkout`)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `thesquatrack`.`Set`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`Set` ;

CREATE TABLE IF NOT EXISTS `thesquatrack`.`Set` (
  `idSet` INT NOT NULL AUTO_INCREMENT,
  `SetNumber` INT NOT NULL,
  `idExercise` INT NOT NULL,
  `idWorkout` INT NOT NULL,
  `setWeight` DOUBLE NOT NULL DEFAULT 0,
  `setUnit` VARCHAR(3) NOT NULL DEFAULT 'lbs',
  `setReps` INT NOT NULL DEFAULT 0,
  `setRPE` FLOAT NOT NULL DEFAULT 0,
  `workingSet` TINYINT DEFAULT 0,
  `paused` TINYINT DEFAULT 0,
  `belt` TINYINT DEFAULT 0,
  `unilateral` TINYINT DEFAULT 0,
  `setComment` TEXT NULL,
  `setVideo` VARCHAR(255) NULL,
  `isPR` TINYINT DEFAULT 0,   -- help track historical pr data
  PRIMARY KEY (`idSet`),
  UNIQUE INDEX `idSet_UNIQUE` (`idSet` ASC) VISIBLE,
  UNIQUE INDEX `unique_set_per_exercise` (`idWorkout`, `idExercise`, `SetNumber`),
  INDEX `fk_Set_Exercise1_idx` (`idExercise` ASC) VISIBLE,
  INDEX `fk_Set_Workout1_idx` (`idWorkout` ASC) VISIBLE,
  CONSTRAINT `fk_Set_Exercise1`
    FOREIGN KEY (`idExercise`)
    REFERENCES `thesquatrack`.`Exercise` (`idExercise`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Set_Workout1`
    FOREIGN KEY (`idWorkout`)
    REFERENCES `thesquatrack`.`Workout` (`idWorkout`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thesquatrack`.`UserTrackedExercise`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`UserTrackedExercise`;

CREATE TABLE `thesquatrack`.`UserTrackedExercise` (
  `idUser` INT NOT NULL,
  `idExercise` INT NOT NULL,
  `dateAdded` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`idUser`, `idExercise`),

  INDEX `fk_UTE_user_idx` (`idUser`),
  INDEX `fk_UTE_exercise_idx` (`idExercise`),

  CONSTRAINT `fk_UTE_user`
    FOREIGN KEY (`idUser`)
    REFERENCES `thesquatrack`.`User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,

  CONSTRAINT `fk_UTE_exercise`
    FOREIGN KEY (`idExercise`)
    REFERENCES `thesquatrack`.`Exercise` (`idExercise`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `thesquatrack`.`UserFollows`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`UserFollows` ;

CREATE TABLE IF NOT EXISTS `thesquatrack`.`UserFollows` (
  `followerID` INT NOT NULL,
  `followeeID` INT NOT NULL,
  `dateFollowed` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`followerID`, `followeeID`),
  INDEX `fk_User_has_User_User2_idx` (`followeeID` ASC) VISIBLE,
  INDEX `fk_User_has_User_User1_idx` (`followerID` ASC) VISIBLE,
  CONSTRAINT `fk_User_has_User_User1`
    FOREIGN KEY (`followerID`)
    REFERENCES `thesquatrack`.`User` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_User_User2`
    FOREIGN KEY (`followeeID`)
    REFERENCES `thesquatrack`.`User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `thesquatrack`.Conversation
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`Conversation`;

CREATE TABLE `Conversation` (
  `idConversation` INT NOT NULL AUTO_INCREMENT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  `type` ENUM('dm', 'group') NOT NULL,
  `title` VARCHAR(255) NULL,
  `createdBy` INT NOT NULL,
  `isLocked` TINYINT NOT NULL DEFAULT 0,

  PRIMARY KEY (`idConversation`),

  INDEX `fk_conversation_creator_idx` (`createdBy`),

  CONSTRAINT `fk_conversation_creator`
    FOREIGN KEY (`createdBy`)
    REFERENCES `User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `thesquatrack`.ConversationParticipant
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`ConversationParticipant`;

CREATE TABLE `thesquatrack`.`ConversationParticipant` (
  `idConversation` INT NOT NULL,
  `idUser` INT NOT NULL,
  `lastReadAt` DATETIME NULL,
  `isMuted` TINYINT NOT NULL DEFAULT 0,

  PRIMARY KEY (`idConversation`, `idUser`),

  INDEX `fk_CP_user_idx` (`idUser`),
  INDEX `fk_CP_conversation_idx` (`idConversation`),

  CONSTRAINT `fk_CP_conversation`
    FOREIGN KEY (`idConversation`)
    REFERENCES `thesquatrack`.`Conversation` (`idConversation`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,

  CONSTRAINT `fk_CP_user`
    FOREIGN KEY (`idUser`)
    REFERENCES `thesquatrack`.`User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `thesquatrack`.Message
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`Message`;

CREATE TABLE `thesquatrack`.`Message` (
  `idMessage` INT NOT NULL AUTO_INCREMENT,
  `idConversation` INT NOT NULL,
  `idSender` INT NOT NULL,
  `msgDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `message` TEXT NULL,

  PRIMARY KEY (`idMessage`),

  INDEX `fk_Message_sender_idx` (`idSender`),
  INDEX `fk_Message_conversation_idx` (`idConversation`),

  CONSTRAINT `fk_Message_sender`
    FOREIGN KEY (`idSender`)
    REFERENCES `thesquatrack`.`User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,

  CONSTRAINT `fk_Message_conversation`
    FOREIGN KEY (`idConversation`)
    REFERENCES `thesquatrack`.`Conversation` (`idConversation`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Queries to run for default database
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Low Bar Squat','LB_Squat','squat', 'Barbell placement atop rear delts');
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('High Bar Squat','HB_Squat', 'squat','Barbell placement atop traps');
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Front Squat', 'Fr_Squat','squat','Barbell placement along front delts');
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('SSB Squat','SSB', 'squat', 'Barbell squat with the Safety Squat Bar');

INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Competition Grip Bench Press', 'C_Bench','bench', "Bench press perfomed with competition grip width");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Close Grip Bench', 'CG_Bench', 'bench', "Bench press performed with grip closer than competition grip");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Board Press', 'BoardPress', 'bench', "Bench press performed with reduced ROM");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Over Head Press', 'OHP', 'bench', "Barbell pressed overhead, performed while standing");

INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Conventional Deadlift', 'Deadlift', 'deadlift', "Deadlift performed with grip ouside of legs");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Sumo Deadlift', 'Sumo', 'deadlift', "Deadlift performed with grip ouside of legs");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Deficit Conventional Deadlift', 'Def_Deads', 'deadlift', "Deadlift performed with greater ROM than from the floor");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Deficit Sumo Deadlift', 'Def_Deads', 'deadlift', "Deadlift performed with greater ROM than from the floor");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Romanian Deadlift', 'Romanians', 'deadlift', "Convetional Deadlift performed with only a slight bend in the knees");

INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Bicep Curls Barbell', 'BB_Curls', 'accessory', "curls done with an olympic barbell");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Bulgarian Split Squats', 'Bulgarians', 'accessory', "The thing you do not like to do");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Pull ups wide grip', 'Pullups', 'accessory', "pull-ups done with hands farther apart than medium grip pull-ups");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Pull ups medium grip', 'Pullups', 'accessory', "pull-ups done with hands closer togther than wide grip pull-ups");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Hamstring curls', 'Ham_Curls', 'accessory', "bend knees. heels towards butt.");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Standing calf raises', 'S_Calf', 'accessory', "Stand and get on your tippy toes.");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Belt Squat', 'B_Squat', 'accessory', "Squat on a belt machine");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Cable lateral raise', 'Lat_Raise', 'accessory', "lateral raises with cable machine");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Cable tricep extension', 'Cbl_Tricep', 'accessory', "tricep extensions on cable machine. aka tricep push-down.");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Cable AB Crunch', 'Cbl_Crunch', 'accessory', "Ab crunch on cable machine.");

INSERT INTO User (Email, userName, passwordHash, userFirst, userLast)
VALUES ('test1@example.com', 'goob', 'pass', 'Gabriel', 'Malone' );

INSERT INTO User (Email, userName, passwordHash)
VALUES ('test2@example.com', 'curtis', 'pass');

INSERT INTO User (Email, userName, passwordHash)
VALUES ('test3@example.com', 'stella', 'pass');

INSERT INTO User (Email, userName, passwordHash)
VALUES ('test4@example.com', 'yvette', 'pass');

INSERT INTO User (Email, userName, passwordHash)
VALUES ('test5@example.com', 'moose', 'pass');

INSERT INTO User (Email, userName, passwordHash)
VALUES ('test6@example.com', 'shawzito', 'pass');

INSERT INTO Workout (Date, idUser, workoutTitle)
VALUES ('2026-01-08 18:00:00', 1, 'Push Day');

SELECT idWorkout INTO @w2 FROM Workout WHERE workoutTitle='Push Day';

SELECT idExercise INTO @cg FROM Exercise WHERE ExerciseName='Close Grip Bench';
SELECT idExercise INTO @lat FROM Exercise WHERE ExerciseName='Cable lateral raise';

INSERT INTO ExerciseOrderInWorkout VALUES
(@cg, @w2, 1),
(@lat, @w2, 2);

INSERT INTO `Set` VALUES
(NULL,1,@cg,@w2,185,'lbs',10,7,1,0,0,0,NULL,NULL,0),
(NULL,2,@cg,@w2,205,'lbs',6,8,1,0,0,0,NULL,NULL,0),
(NULL,3,@cg,@w2,225,'lbs',3,9,1,0,0,0,NULL,NULL,0);

INSERT INTO `Set` VALUES
(NULL,1,@lat,@w2,20,'lbs',15,6,0,0,0,0,NULL,NULL,0),
(NULL,2,@lat,@w2,30,'lbs',12,7,0,0,0,0,NULL,NULL,0);

INSERT INTO Workout (Date, idUser, workoutTitle)
VALUES ('2026-01-05 10:00:00', 1, 'Legs & Shoulders');

SELECT idWorkout INTO @w1 FROM Workout WHERE workoutTitle='Legs & Shoulders';

SELECT idExercise INTO @lb FROM Exercise WHERE ExerciseName='Low Bar Squat';
SELECT idExercise INTO @ohp FROM Exercise WHERE ExerciseName='Over Head Press';

INSERT INTO ExerciseOrderInWorkout VALUES
(@lb, @w1, 1),
(@ohp, @w1, 2);

INSERT INTO `Set` VALUES
(NULL,1,@lb,@w1,315,'lbs',8,7,1,0,1,0,'Felt strong',NULL,0),
(NULL,2,@lb,@w1,365,'lbs',5,8,1,0,1,0,NULL,NULL,0),
(NULL,3,@lb,@w1,405,'lbs',3,9,1,0,1,0,NULL,NULL,0);

INSERT INTO `Set` VALUES
(NULL,1,@ohp,@w1,95,'lbs',10,6,0,0,0,0,NULL,NULL,0),
(NULL,2,@ohp,@w1,115,'lbs',6,8,0,0,0,0,NULL,NULL,0);

INSERT INTO Workout (Date, idUser, workoutTitle)
VALUES ('2026-01-11 16:30:00', 1, 'Deadlift Day');

SELECT idWorkout INTO @w3 FROM Workout WHERE workoutTitle='Deadlift Day';

SELECT idExercise INTO @sumo FROM Exercise WHERE ExerciseName='Sumo Deadlift';
SELECT idExercise INTO @ham FROM Exercise WHERE ExerciseName='Hamstring curls';

INSERT INTO ExerciseOrderInWorkout VALUES
(@sumo, @w3, 1),
(@ham, @w3, 2);

INSERT INTO `Set` VALUES
(NULL,1,@sumo,@w3,405,'lbs',5,7,1,0,1,0,NULL,NULL,0),
(NULL,2,@sumo,@w3,455,'lbs',3,8,1,0,1,0,NULL,NULL,0),
(NULL,3,@sumo,@w3,495,'lbs',1,9,1,0,1,0,'Grinder',NULL,1);

INSERT INTO `Set` VALUES
(NULL,1,@ham,@w3,60,'lbs',15,6,0,0,0,0,NULL,NULL,0),
(NULL,2,@ham,@w3,80,'lbs',10,7,0,0,0,0,NULL,NULL,0);

INSERT INTO Workout (Date, idUser, workoutTitle)
VALUES ('2026-01-13 14:00:00', 1, 'Pain & Suffering');

SELECT idWorkout INTO @w4 FROM Workout WHERE workoutTitle='Pain & Suffering';

SELECT idExercise INTO @bul FROM Exercise WHERE ExerciseName='Bulgarian Split Squats';
SELECT idExercise INTO @pull FROM Exercise WHERE ExerciseName='Pull ups wide grip';

INSERT INTO ExerciseOrderInWorkout VALUES
(@bul, @w4, 1),
(@pull, @w4, 2);

INSERT INTO `Set` VALUES
(NULL,1,@bul,@w4,40,'lbs',10,8,0,0,0,1,'Hate this',NULL,0),
(NULL,2,@bul,@w4,50,'lbs',8,9,0,0,0,1,NULL,NULL,0);

INSERT INTO `Set` VALUES
(NULL,1,@pull,@w4,0,'lbs',12,7,0,0,0,0,NULL,NULL,0),
(NULL,2,@pull,@w4,0,'lbs',8,8,0,0,0,0,NULL,NULL,0);