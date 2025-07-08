SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`User` ;

CREATE TABLE IF NOT EXISTS `mydb`.`User` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `userName` VARCHAR(255) NOT NULL,
  `userFirst` VARCHAR(45) NULL,
  `userLast` VARCHAR(45) NULL,
  `Email` VARCHAR(45) NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `userName_UNIQUE` (`userName` ASC) VISIBLE,
  UNIQUE INDEX `idUser_UNIQUE` (`idUser` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Workout`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Workout` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Workout` (
  `idWorkout` INT NOT NULL AUTO_INCREMENT,
  `Date` DATETIME NOT NULL,
  `idUser` INT NOT NULL,
  `workoutTitle` VARCHAR(255) NULL,
  `userWeight` INT NULL,
  `userAge` INT NULL,
  `fatigueRating` INT NULL,
  INDEX `fk_Workout_User_idx` (`idUser` ASC) VISIBLE,
  PRIMARY KEY (`idWorkout`),
  UNIQUE INDEX `idWorkout_UNIQUE` (`idWorkout` ASC) VISIBLE,
  UNIQUE INDEX `uq_user_date` (`idUser` ASC, `Date` ASC) VISIBLE,
  CONSTRAINT `fk_Workout_User`
    FOREIGN KEY (`idUser`)
    REFERENCES `mydb`.`User` (`idUser`)
    ON DELETE CASCADE  -- Changed from NO ACTION to CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Exercise`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Exercise` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Exercise` (
  `idExercise` INT NOT NULL AUTO_INCREMENT,
  `ExerciseName` VARCHAR(45) NULL,
  `ExerciseDescription` VARCHAR(45) NULL,
  UNIQUE INDEX `idExercise_UNIQUE` (`idExercise` ASC) VISIBLE,
  PRIMARY KEY (`idExercise`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Set`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Set` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Set` (
  `idSet` INT NOT NULL AUTO_INCREMENT,
  `SetNumber` INT NOT NULL,
  `idExercise` INT NOT NULL,
  `idWorkout` INT NOT NULL,
  `setWeight` DOUBLE NOT NULL DEFAULT 0,
  `setReps` INT NOT NULL DEFAULT 0,
  `setRPE` FLOAT NOT NULL DEFAULT 0,
  `paused` TINYINT NULL,
  `setComment` BLOB NULL,
  `setVideo` VARCHAR(45) NULL,
  `setCompleted` TINYINT NULL,
  PRIMARY KEY (`idSet`),
  UNIQUE INDEX `idSet_UNIQUE` (`idSet` ASC) VISIBLE,
  -- UNIQUE INDEX `unique_set_per_exercise` (`idWorkout`, `idExercise`, `SetNumber`),
  INDEX `fk_Set_Exercise1_idx` (`idExercise` ASC) VISIBLE,
  INDEX `fk_Set_Workout1_idx` (`idWorkout` ASC) VISIBLE,
  CONSTRAINT `fk_Set_Exercise1`
    FOREIGN KEY (`idExercise`)
    REFERENCES `mydb`.`Exercise` (`idExercise`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Set_Workout1`
    FOREIGN KEY (`idWorkout`)
    REFERENCES `mydb`.`Workout` (`idWorkout`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Queries to run for default database
INSERT INTO Exercise (ExerciseName, ExerciseDescription) VALUES ('Low-Bar-Squat', '');
INSERT INTO Exercise (ExerciseName, ExerciseDescription) VALUES ('High-Bar-Squat', '');
INSERT INTO Exercise (ExerciseName, ExerciseDescription) VALUES ('Front-Squat', '');
INSERT INTO Exercise (ExerciseName, ExerciseDescription) VALUES ('SSB-Squat', '');
INSERT INTO Exercise (ExerciseName, ExerciseDescription) VALUES ('Bench', '');
INSERT INTO Exercise (ExerciseName, ExerciseDescription) VALUES ('Close-Grip-Bench', '');
INSERT INTO Exercise (ExerciseName, ExerciseDescription) VALUES ('Deadlift', '');
INSERT INTO Exercise (ExerciseName, ExerciseDescription) VALUES ('Paused-Deadlift', '');
INSERT INTO Exercise (ExerciseName, ExerciseDescription) VALUES ('Deficit-Deadlift', '');
INSERT INTO Exercise (ExerciseName, ExerciseDescription) VALUES ('Romanian-Deadlift', '');

-- Queries to run for default database
INSERT INTO User (userName) VALUES ('Goobert');
INSERT INTO Workout (Date, idUser)
VALUES ('2025-07-04', 1);
INSERT INTO `Set` (setNumber,idExercise, idWorkout, setWeight, setReps, setRPE, setCompleted)
VALUES (1, 1, 1, 185, 5, 8, 1);
INSERT INTO `Set` (SetNumber, idExercise, idWorkout, setWeight, setReps, setRPE, setCompleted)
VALUES (2, 1, 1, 225, 12, 9, 1);
INSERT INTO `Set` (SetNumber, idExercise, idWorkout, setWeight, setReps, setRPE, setCompleted)
VALUES (3, 1, 1, 315, 7, 6, 1);
INSERT INTO `Set` (SetNumber, idExercise, idWorkout, setWeight, setReps, setRPE, setCompleted)
VALUES (1, 5, 1, 225, 5, 8, 1);
INSERT INTO `Set` (SetNumber, idExercise, idWorkout, setWeight, setReps, setRPE, setCompleted)
VALUES (1, 7, 1, 225, 5, 8, 1);
INSERT INTO Workout (Date, idUser)
VALUES ('2025-7-25', 1);
INSERT INTO `Set` (SetNumber, idExercise, idWorkout, setWeight, setReps, setRPE, setCompleted)
VALUES (1, 3, 2, 225, 5, 8, 1);
INSERT INTO Workout (Date, idUser)
VALUES ('2025-7-11', 1);
INSERT INTO `Set` (SetNumber, idExercise, idWorkout, setWeight, setReps, setRPE, setCompleted)
VALUES (1, 6, 3, 225, 5, 8, 1);


