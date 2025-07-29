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
-- Table `thesquatrack`.`User` a
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
  `isAdmin` TINYINT NOT NULL DEFAULT 0,
  `isCoach` TINYINT NOT NULL DEFAULT 0,
  `isPublic` TINYINT NOT NULL DEFAULT 1,
  `isLoggedIn` TINYINT NOT NULL DEFAULT 0,
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
  `numberOfLifts` INT NOT NULL DEFAULT 1, -- this will help me track Exercise Order more easily 
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
-- Table `thesquatrack`.`Chats`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `thesquatrack`.`Chats` ;

CREATE TABLE IF NOT EXISTS `thesquatrack`.`Chats` (
  `idMessage` INT NOT NULL AUTO_INCREMENT,
  `idSender` INT NOT NULL,
  `idRecipient` INT NOT NULL,
  `msgDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `message` TEXT NULL,
  PRIMARY KEY (`idMessage`),
  INDEX `fk_User_has_User_User4_idx` (`idRecipient` ASC) VISIBLE,
  INDEX `fk_User_has_User_User3_idx` (`idSender` ASC) VISIBLE,
  CONSTRAINT `fk_User_has_User_User3`
    FOREIGN KEY (`idSender`)
    REFERENCES `thesquatrack`.`User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_User_User4`
    FOREIGN KEY (`idRecipient`)
    REFERENCES `thesquatrack`.`User` (`idUser`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Queries to run for default database
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Low-Bar-Squat','LB_Squat','squat', 'Barbell placement atop rear delts');
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('High-Bar-Squat','HB_Squat', 'squat','Barbell placement atop traps');
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Front-Squat', 'Fr_Squat','squat','Barbell placement along front delts');
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('SSB-Squat','SSB', 'squat', 'Barbell squat with the Safety Squat Bar');

INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Competition-Grip-Bench-Press', 'C_Bench','bench', "Bench press perfomed with competition grip width");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Close-Grip-Bench', 'CG_Bench', 'bench', "Bench press performed with grip closer than competition grip");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Board-Press', 'BoardPress', 'bench', "Bench press performed with reduced ROM");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Over-Head-Press', 'OHP', 'bench', "Barbell pressed overhead, performed while standing");

INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Conventional-Deadlift', 'Deadlift', 'deadlift', "Deadlift performed with grip ouside of legs");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Sumo-Deadlift', 'Sumo', 'deadlift', "Deadlift performed with grip ouside of legs");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Deficit-Conventional-Deadlift', 'Def_Deads', 'deadlift', "Deadlift performed with greater ROM than from the floor");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Deficit-Sumo-Deadlift', 'Def_Deads', 'deadlift', "Deadlift performed with greater ROM than from the floor");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Romanian-Deadlift', 'Romanians', 'deadlift', "Convetional Deadlift performed with only a slight bend in the knees");

INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Bicep-Curls-barbell', 'BB_Curls', 'accessory', "curls done with an olympic barbell");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Bulgarian-Split-Squats', 'Bulgarians', 'accessory', "The thing you do not like to do");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Pull-ups-wide-grip', 'Pullups', 'accessory', "pull-ups done with hands farther apart than medium grip pull-ups");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Pull-ups-medium-grip', 'Pullups', 'accessory', "pull-ups done with hands closer togther than wide grip pull-ups");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Hamstring-curls', 'Ham_Curls', 'accessory', "bend knees. heels towards butt.");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Standing-calf-raises', 'S_Calf', 'accessory', "Stand and get on your tippy toes.");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Belt-Squat', 'B_Squat', 'accessory', "Squat on a belt machine");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Cable-lateral-raise', 'Lat_Raise', 'accessory', "lateral raises with cable machine");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Cable-tricep-extension', 'Cbl_Tricep', 'accessory', "tricep extensions on cable machine. aka tricep push-down.");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Cable-AB-Crunch', 'Cbl_Crunch', 'accessory', "Ab crunch on cable machine.");

          