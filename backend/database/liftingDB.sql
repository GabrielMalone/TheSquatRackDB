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
  `numberOfLifts` INT NOT NULL DEFAULT 1, -- this will help me track Exercise Order more easily 
  `workoutTitle` VARCHAR(255) NULL,
  `userWeight` INT NULL,
  `userAge` INT NULL,
  `fatigueRating` INT NULL,
  `sessionNote`  VARCHAR(1500),
  INDEX `fk_Workout_User_idx` (`idUser` ASC) VISIBLE,
  PRIMARY KEY (`idWorkout`),
  UNIQUE INDEX `idWorkout_UNIQUE` (`idWorkout` ASC) VISIBLE,
  UNIQUE INDEX `uq_user_date` (`idUser` ASC, `Date` ASC) VISIBLE,
  CONSTRAINT `fk_Workout_User`
    FOREIGN KEY (`idUser`)
    REFERENCES `mydb`.`User` (`idUser`)
    ON DELETE CASCADE  
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Exercise`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Exercise` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Exercise` (
  `idExercise` INT NOT NULL AUTO_INCREMENT,
  `ExerciseName` VARCHAR(45) NULL,
  `abbreviation` VARCHAR(10) NULL,
  `ExerciseCategory` VARCHAR(45) NULL, -- does this exercise fall under a squat deadlift bench variation ?
  `ExerciseDescription` VARCHAR(255) NULL,
  UNIQUE INDEX `idExercise_UNIQUE` (`idExercise` ASC) VISIBLE,
  PRIMARY KEY (`idExercise`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`ExerciseOrderInWorkout`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`ExerciseOrderInWorkout`;

CREATE TABLE IF NOT EXISTS `mydb`.`ExerciseOrderInWorkout` (
  `idExercise` INT NOT NULL,
  `idWorkout` INT NOT NULL,
  `Order` INT NOT NULL,  
  PRIMARY KEY (`idExercise`, `idWorkout`),
  UNIQUE (`idWorkout`, `Order`), 
  INDEX `fk_Exercise_has_Workout_Workout1_idx` (`idWorkout` ASC) VISIBLE,
  INDEX `fk_Exercise_has_Workout_Exercise1_idx` (`idExercise` ASC) VISIBLE,
  CONSTRAINT `fk_Exercise_has_Workout_Exercise1`
    FOREIGN KEY (`idExercise`)
    REFERENCES `mydb`.`Exercise` (`idExercise`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Exercise_has_Workout_Workout1`
    FOREIGN KEY (`idWorkout`)
    REFERENCES `mydb`.`Workout` (`idWorkout`)
    ON DELETE CASCADE 
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

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
  `workingSet` TINYINT DEFAULT 0,
  `paused` TINYINT DEFAULT 0,
  `belt` TINYINT DEFAULT 0,
  `unilateral` TINYINT DEFAULT 0,
  `setComment` BLOB NULL,
  `setVideo` VARCHAR(255) NULL,
  `isPR` TINYINT DEFAULT 0,   -- help track historical pr data
  PRIMARY KEY (`idSet`),
  UNIQUE INDEX `idSet_UNIQUE` (`idSet` ASC) VISIBLE,
  UNIQUE INDEX `unique_set_per_exercise` (`idWorkout`, `idExercise`, `SetNumber`),
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
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Pull-ups-wide-grip', 'pullups', 'accessory', "pull-ups done with hands farther apart than medium grip pull-ups");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Pull-ups-medium-grip', 'pullups', 'accessory', "pull-ups done with hands closer togther than wide grip pull-ups");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Hamstring-curls', 'Ham-Curls', 'accessory', "bend knees. heels towards butt.");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Standing-calf-raises', 'S-Calf', 'accessory', "Stand and get on your tippy toes.");
INSERT INTO Exercise (ExerciseName, abbreviation, ExerciseCategory, ExerciseDescription) VALUES ('Belt-Squat', 'B-Squat', 'accessory', "Squat on a belt machine");