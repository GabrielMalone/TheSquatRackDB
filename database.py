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
def getExercises():
    cnx = connect()
    exercises = []
    if (cnx.is_connected()):
        cursor = cnx.cursor(dictionary=True)   # dic = format for JSON objects
        cursor.execute('SELECT * FROM Exercise')
        exercises = cursor.fetchall()

        categorized_lifts = {}          # then package results by lift category 
        cat_lifts = [] # shadow the dictionary above for returning to front end
        for exercise in exercises:
            cur_category = exercise["ExerciseCategory"]
            if cur_category not in categorized_lifts:
                category = {
                    "category" : cur_category,
                    "lifts_in_category"    : []
                }
                categorized_lifts[cur_category] = category
                cat_lifts.append(category)
            lift_details = {
                "Description"  : exercise["ExerciseDescription"],
                "abbreviation" : exercise["abbreviation"],
                "exerciseName" : exercise["ExerciseName"],
                "category"     : cur_category,
                "exerciseID"   : exercise["idExercise"] 
            }
            categorized_lifts[cur_category]["lifts_in_category"].append(lift_details)
            categorized_lifts[cur_category]["lifts_in_category"]
  
        cursor.close()
        cnx.close()

    return  cat_lifts
#------------------------------------------------------------------------------
def createExerciseOrder(idWorkout, idExercise, orderNumber):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor()
            cursor.execute(
                '''
                    INSERT into `ExerciseOrderInWorkout`
                        (idWorkout, idExercise, `Order`)
                    VALUES 
                        (%s, %s, %s)
                ''', 
                (idWorkout, idExercise, orderNumber))
            cnx.commit()
            cursor.close()
            cnx.close()
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno     
#------------------------------------------------------------------------------
def deleteExerciseOrder(idWorkout, idExercise):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor()
            cursor.execute(
                '''
                    DELETE from `ExerciseOrderInWorkout`
                    WHERE idWOrkout = %s AND idExercise = %s; 
                ''', 
                (idWorkout, idExercise))
            cnx.commit()
            cursor.close()
            cnx.close()
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno     
#------------------------------------------------------------------------------
def updateExerciseOrder(idWorkout, idExercise, orderNumber):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor()
            cursor.execute(
                '''
                    UPDATE 
                        `ExerciseOrderInWorkout`
                    SET
                        `Order` = %s
                    WHERE idWorkout = %s AND idExercise = %s; 
                ''', 
                (orderNumber, idWorkout, idExercise))
            cnx.commit()
            cursor.close()
            cnx.close()
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno     
#------------------------------------------------------------------------------
def insertNewExercise(setData):

    idExercise  = setData["idExercise"]
    idWorkout   = setData["idWorkout"]
    SetNumber   = setData["SetNumber"]
    Order       = setData["Order"]

    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True)
            # exercise order first
            cursor.execute(
                '''
                    INSERT INTO 
                        `ExerciseOrderInWorkout` (idExercise, idWorkout, `Order`)
                    VALUES 
                        (%s, %s, %s);
                ''', (idExercise, idWorkout, Order))
            cnx.commit()
            # then the exercise set info
            cursor.execute(
                '''
                    INSERT into `Set`
                        (idExercise, idWorkout, SetNumber)
                    VALUES 
                        (%s, %s, %s)
                ''', 
                (idExercise, idWorkout, SetNumber))
            cnx.commit()
            newSetID = cursor.lastrowid
            newSetID = cursor.lastrowid
            # then get all the setInfo returned back 
            cursor.execute(
                '''
                    SELECT * FROM `Set`
                    WHERE idSet = %s
                ''',
                (newSetID,))
            newSet = cursor.fetchone()
            cursor.close()
            cnx.close()
            return newSet
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno       
#------------------------------------------------------------------------------
def createSet(setData):
    idExercise  = setData["idExercise"]
    idWorkout   = setData["idWorkout"]
    SetNumber   = setData["SetNumber"]

    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True)
            cursor.execute(
                '''
                    INSERT into `Set`
                        (idExercise, idWorkout, SetNumber)
                    VALUES 
                        (%s, %s, %s)
                ''', 
                (idExercise, idWorkout, SetNumber))
            cnx.commit()
            newSetID = cursor.lastrowid
            newSetID = cursor.lastrowid
            # then get all the setInfo returned back 
            cursor.execute(
                '''
                    SELECT * FROM `Set`
                    WHERE idSet = %s
                ''',
                (newSetID,))
            newSet = cursor.fetchone()
            cursor.close()
            cnx.close()
            return newSet
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno   
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
            cursor.close()
            cnx.close()
            return {"setWeight":setWeight, "setReps":setReps, "setRPE":setRPE,"idSet":idSet}
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return err.errno
#------------------------------------------------------------------------------          
def reorderSetNumbers(idWorkout, idExercise):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor()
               # select all sets for this workout & exercise, ordered by set #
            cursor.execute("""
                SELECT idSet
                FROM `Set`
                WHERE idWorkout = %s AND idExercise = %s
                ORDER BY `SetNumber` ASC;
            """, (idWorkout, idExercise))
            sets = cursor.fetchall()

            for i, row in enumerate(sets, start=1):# re-assign set #s from 1..n
                idSet = row[0] #only one value, the setID in the returned tuple
                cursor.execute("""
                    UPDATE `Set`
                    SET `SetNumber` = %s
                    WHERE idSet = %s;
                """, (i, idSet))

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
                    e.abbreviation AS exercise,
                    e.idExercise AS exerciseID,
                    eow.Order AS exerciseOrder,
                    s.idSet AS setID,
                    s.SetNumber AS `set`,
                    s.idWorkout AS workoutID,
                    s.setWeight AS weight,
                    s.setReps AS reps,
                    s.setRPE AS rpe,
                    s.paused AS paused,
                    s.setComment AS comment,
                    s.setVideo AS videoLink
                FROM 
                    Workout w
                JOIN 
                    ExerciseOrderInWorkout eow ON w.idWorkout = eow.idWorkout
                JOIN 
                    Exercise e ON e.idExercise = eow.idExercise
                JOIN 
                    `Set` s ON s.idWorkout = w.idWorkout AND s.idExercise = e.idExercise
                WHERE 
                    w.idWorkout = %s
                ORDER BY 
                    eow.Order ASC, s.SetNumber ASC
            ''', (workoutID,))

            workout = cursor.fetchall()

            cursor.close()
            cnx.close()

            lifts = [] # preserve order and shadow exercise_map
            unique_lifts_in_workout = {}

            for lift in workout:
                lift_id = lift["exerciseID"]
                if lift_id not in unique_lifts_in_workout:
                    # all non set info
                    lift_info = {
                        "exercise"          : lift["exercise"],
                        "exerciseID"        : lift_id,
                        "exerciseOrder"     : lift["exerciseOrder"],
                        "workoutID"         : lift["workoutID"],
                        "sets"              : [] 
                    }
                    unique_lifts_in_workout[lift_id] = lift_info
                    lifts.append(lift_info) 
                
                set_info = {
                    "setID"     : lift["setID"],
                    "set"       : lift["set"],
                    "weight"    : lift["weight"],
                    "reps"      : lift["reps"],
                    "rpe"       : lift["rpe"],
                    "paused"    : lift["paused"],
                    "comment"   : lift["comment"],
                    "videoLink" : lift["videoLink"]
                }
                unique_lifts_in_workout[lift_id]["sets"].append(set_info)

            return lifts

        
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.close()
            return err.errno
#------------------------------------------------------------------------------
def createNewWorkout(Date, userID):
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
        JOIN 
            `Set` s ON w.idWorkout = s.idWorkout
        JOIN 
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