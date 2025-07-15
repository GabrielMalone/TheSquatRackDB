#------------------------------------------------------------------------------
import mysql.connector
from dotenv import load_dotenv
import os
#------------------------------------------------------------------------------
def connect():
    return mysql.connector.connect(
        user=os.getenv('DB_USER'), 
        password=os.getenv('DB_PASSWORD'), 
        database=os.getenv('DB_NAME'),
        host=os.getenv('DB_HOST', 'localhost') )
#------------------------------------------------------------------------------
def getMonthlyTrainingVolume(idUser, ExerciseCategories, month, year):
    try:
        cnx = connect()
        cursor = cnx.cursor(dictionary=True, buffered=True)
        results = []
        for ExerciseCategory in ExerciseCategories:
            cursor.execute(
                '''
                SELECT 
                     e.ExerciseCategory AS category, 
                     SUM(s.setWeight * s.setReps) AS total_volume
                FROM 
                    `Set` s 
                JOIN 
                    `Workout` w ON s.idWorkout  = w.idWorkout
                JOIN 
                    `Exercise` e ON s.idExercise = e.idExercise
                JOIN 
                    `User` u ON w.idUser = u.idUser
                WHERE 
                    u.idUser = %s 
                    AND e.ExerciseCategory = %s
                    AND MONTH(w.Date) = %s  
                    AND YEAR(w.Date)  = %s
                ''', 
                (idUser, ExerciseCategory, month+1, year))
            result = cursor.fetchone()['total_volume']
            results.append(result)
        return {
            "success" : True,
            "result"  : results,
        }
    except mysql.connector.Error as err:
        print("MySQL Error:", err)         # This will show you the exact error
        print("Error code:", err.errno)                    # Numeric error code
        cnx.rollback() 
        cnx.close()
        return {
            "success" : False,
            "message" : f' server error: {err.errno}' 
        }  
#------------------------------------------------------------------------------
def getMonthlyTrainingIntensity(idUser, ExerciseCategories, month, year):
    try:
        cnx = connect()
        cursor = cnx.cursor(dictionary=True, buffered=True)
        results = []
        for ExerciseCategory in ExerciseCategories:
            cursor.execute(
                '''
                SELECT 
                     e.ExerciseCategory AS category, 
                     SUM(s.setRPE)/COUNT(s.idSet) AS averageIntensity
                FROM 
                    `Set` s 
                JOIN 
                    `Workout` w ON s.idWorkout  = w.idWorkout
                JOIN 
                    `Exercise` e ON s.idExercise = e.idExercise
                JOIN 
                    `User` u ON w.idUser = u.idUser
                WHERE 
                    u.idUser = %s 
                    AND e.ExerciseCategory = %s
                    AND MONTH(w.Date) = %s  
                    AND YEAR(w.Date)  = %s
                ''', 
                (idUser, ExerciseCategory, month+1, year))
            result = cursor.fetchone()['averageIntensity']
            results.append(result)
        return {
            "success" : True,
            "result"  : results,
        }
    except mysql.connector.Error as err:
        print("MySQL Error:", err)         # This will show you the exact error
        print("Error code:", err.errno)                    # Numeric error code
        cnx.rollback() 
        cnx.close()
        return {
            "success" : False,
            "message" : f' server error: {err.errno}' 
        }  
#------------------------------------------------------------------------------
def getMonthlyTrainingFrequency(idUser, ExerciseCategories, month, year):
    try:
        cnx = connect()
        cursor = cnx.cursor(dictionary=True, buffered=True)
        results = []
        for ExerciseCategory in ExerciseCategories:
            cursor.execute(
                '''
                SELECT 
                    e.ExerciseCategory AS category, 
                    DAY(w.Date) AS dayTrained
                FROM 
                    `Set` s 
                JOIN 
                    `Workout` w ON s.idWorkout  = w.idWorkout
                JOIN 
                    `Exercise` e ON s.idExercise = e.idExercise
                JOIN 
                    `User` u ON w.idUser = u.idUser
                WHERE 
                    u.idUser = %s 
                    AND e.ExerciseCategory = %s
                    AND MONTH(w.Date) = %s  
                    AND YEAR(w.Date)  = %s
                GROUP BY
                    DAY(w.Date)
                ''', 
                (idUser, ExerciseCategory, month+1, year))
            # the above query returns a list of the unique days where that lift 
            # was trained. can then sum those unique days for total frequency
            result = cursor.fetchall()
            frequency = len(result)
            results.append(frequency)
        return {
            "success" : True,
            "result"  : results,
        }
    except mysql.connector.Error as err:
        print("MySQL Error:", err)         # This will show you the exact error
        print("Error code:", err.errno)                    # Numeric error code
        cnx.rollback() 
        cnx.close()
        return {
            "success" : False,
            "message" : f' server error: {err.errno}' 
        }  
#------------------------------------------------------------------------------
def getPRDataForLift(idUser, Exercise):
    try:
        cnx = connect()
        cursor = cnx.cursor(dictionary=True, buffered=True)
        cursor.execute(
            '''
            SELECT 
                s.setWeight AS weight,
                s.setReps AS reps,
                w.Date as date,
                w.idWorkout as idWorkout
            FROM 
                `Set` s
            JOIN 
                `Workout` w ON s.idWorkout = w.idWorkout
            JOIN
                `Exercise` e ON s.idExercise = e.idExercise
            WHERE 
                e.idExercise = %s AND w.idUser = %s 
            ORDER BY 
                reps ASC, weight DESC
            ''', 
            (Exercise, idUser))
        result = cursor.fetchall()
        return result
    except mysql.connector.Error as err:
        print("MySQL Error:", err)         # This will show you the exact error
        print("Error code:", err.errno)                    # Numeric error code
        cnx.rollback() 
        cnx.close()
        return {
            "success" : False,
            "message" : f' server error: {err.errno}' 
        }  
#------------------------------------------------------------------------------
load_dotenv()


# -- LIFTETIME SQUAT VOLUME QUERY  (accounts for all squat variations)--


# SELECT 
# 	SUM(s.setWeight * s.setReps) AS total_volume
# FROM 
# 	`Set` s 
# JOIN 
# 	`Workout` w ON s.idWorkout  = w.idWorkout
# JOIN 
# 	`Exercise` e ON s.idExercise = e.idExercise
# JOIN 
# 	`User` u ON w.idUser = u.idUser
# WHERE 
# 	u.idUser = "5" AND e.ExerciseCategory = "squat"

# -- Template for PR Query --

# this will return all the weights that exist for each rep range for a specific exercise and lift.
# sorted by rep range, and then sorted within range by weight.
# then can just pull out the data you want from there. 

# SELECT 
# 	s.setWeight AS weight,
#     s.setReps AS reps,
#     w.Date as date
# FROM 
# 	`Set` s
# JOIN 
# 	`Workout` w ON s.idWorkout = w.idWorkout
# JOIN
# 	`Exercise` e ON s.idExercise = e.idExercise
# WHERE 
# 	e.idExercise = "1" AND w.idUser = "24" 
# ORDER BY 
# 	reps ASC, weight DESC


