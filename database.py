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
def deleteSet(setID):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor()
            cursor.execute(
                '''
                    DELETE from `Set`
                    WHERE idSet = %s
                ''', (setID,))
            cnx.commit()
            updated = cursor.rowcount
            cursor.close()
            cnx.close()
            return updated
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno
    pass
#------------------------------------------------------------------------------
def updateSet(updateInfo):

    idSet     = updateInfo["idSet"]
    setWeight = updateInfo["setWeight"]
    setReps   = updateInfo["setReps"]
    setRPE    = updateInfo["setRPE"]
    
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor()
            cursor.execute(
            '''
                UPDATE
                    `Set`
                SET
                    setWeight = %s,
                    setReps = %s,
                    setRPE = %s
                WHERE 
                    idSet = %s
            ''', 
                (setWeight, setReps, setRPE,idSet))
            cnx.commit()
            updated = cursor.rowcount
            cursor.close()
            cnx.close()
            return updated
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno
#------------------------------------------------------------------------------
def getWorkoutFromID(workoutID):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True)
            cursor.execute('''
            SELECT 
                e.ExerciseName AS exercise,
                s.idSet AS setID,
                s.idWorkout as workoutID,
                s.SetNumber as `set`,
                s.setWeight as weight,
                s.setReps as reps,  
                s.setRPE as rpe,     
                s.paused as paused,
                s.setComment as comment,
                s.setVideo as videoLink
            FROM 
                Workout w
            JOIN 
                `Set` s ON w.idWorkout = s.idWorkout
            JOIN 
                Exercise e ON s.idExercise = e.idExercise
            WHERE 
                w.idWorkout = %s;
            ''', (workoutID,))
            workout = cursor.fetchall()
            cursor.close()
            cnx.close()
            return workout
        except mysql.connector.Error as err:
            print("MySQL Error:", err)    # This will show you the exact error
            print("Error code:", err.errno)               # Numeric error code
            cnx.close()
            return err.errno
#------------------------------------------------------------------------------
def createNewWorkout(userID, Date):
    cnx = connect()
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor()
            cursor.execute('''
                INSERT INTO Workout (Date, idUser)
                VALUES (%s, %s);
                ''',
                (Date, userID))
            cnx.commit()
            new_workout_id = cursor.lastrowid
            cursor.close()
            cnx.close()
            return new_workout_id
        except mysql.connector.Error as err:
            print("MySQL Error:", err)    # This will show you the exact error
            print("Error code:", err.errno)               # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno
#------------------------------------------------------------------------------
def getDaysTrained(userID, Date):
    cnx = connect()
    workouts = []
    if (cnx.is_connected()):
        cursor = cnx.cursor(dictionary=True)   # dic = format for JSON objects
        cursor.execute(
        '''
        SELECT 
            DAY(w.Date) AS day,
            w.idWorkout,
            e.ExerciseName
        FROM 
            Workout w
        LEFT JOIN 
            `Set` s ON w.idWorkout = s.idWorkout
        LEFT JOIN 
            Exercise e ON s.idExercise = e.idExercise
        WHERE 
            w.idUser = %s        
            AND MONTH(w.Date) = %s    
            AND YEAR(w.Date) = %s
        ORDER BY 
            day;
        ''', 
        (userID, Date['month']+1, Date['year']))
        workouts = cursor.fetchall()
        cursor.close()
        cnx.close()
    return workouts
#------------------------------------------------------------------------------
def getLifterInfo(lifterID):
    cnx = connect()
    user = "not found"
    if (cnx.is_connected()):
        cursor = cnx.cursor(dictionary=True)   # dic = format for JSON objects
        cursor.execute('''SELECT * FROM User WHERE idUser = %s''', (lifterID,))
        user = cursor.fetchone()
        cursor.close()
        cnx.close()
    return user
#------------------------------------------------------------------------------
def getLifters():
    cnx = connect();
    users = []
    if (cnx.is_connected()):
        cursor = cnx.cursor(dictionary=True)   # dic = format for JSON objects
        cursor.execute('SELECT * FROM User')
        users = cursor.fetchall()
        cursor.close()
        cnx.close()
    return users
#------------------------------------------------------------------------------
def postNewLifter(newLifter):
    cnx = connect()
    Email       = newLifter["Email"]
    userFirst   = newLifter["userFirst"]
    userLast    = newLifter["userLast"]
    userName    = newLifter["userName"]
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor()
            cursor.execute('''
                INSERT INTO User 
                (userName, userFirst, userLast, Email)
                VALUES(%s,%s,%s,%s)''', 
                (userName, userFirst, userLast, Email)
            )
            cnx.commit()
            cnx.close()
            return 200 
        except mysql.connector.Error as err:
            print("MySQL Error:", err)    # This will show you the exact error
            print("Error code:", err.errno)               # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno
  
#------------------------------------------------------------------------------
def removeLifter(lifterID):
    cnx = connect()
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor()
            cursor.execute('''
                DELETE FROM User 
                WHERE idUser = %s
                ''',
                (lifterID,)
            )
            cnx.commit()
            cnx.close()
            return 200 
        except mysql.connector.Error as err:
            print("MySQL Error:", err)    # This will show you the exact error
            print("Error code:", err.errno)               # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno
  
#------------------------------------------------------------------------------

load_dotenv()