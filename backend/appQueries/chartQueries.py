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
def getMonthlyTrainingVolume(idUser, ExerciseCategory, month, year):
    try:
        cnx = connect()
        cursor = cnx.cursor(dictionary=True, buffered=True)
        cursor.execute(
            '''
            SELECT 
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
        result = cursor.fetchone()
        print (result)
        return {
            "success" : True,
            "result"  : result,
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

