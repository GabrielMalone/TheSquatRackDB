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
def workoutExistCheck(idUser, date):
    try:
        cnx = connect()
        cursor = cnx.cursor(dictionary=True, buffered=True)
        cursor.execute(
            '''
            SELECT
                w.idWorkout AS id
            FROM 
                `Workout` w
            WHERE
                w.idUser = %s AND w.Date = %s
            ''', 
            (idUser, date))
        result = cursor.fetchone()
        if result:
            return {
                "success" : True,
                "idWorkout" : result["id"]
            }
        else : 
            return {
                "success": False,
                "idWorkout": None,
                "message": "No workout found for this user on this date."
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
def getExercises():
    cnx = connect()
    exercises = []
    try:
        if (cnx.is_connected()):
            cursor = cnx.cursor(dictionary=True, buffered=True)  
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
    except mysql.connector.Error as err:
        print("MySQL Error:", err)     # This will show you the exact error
        print("Error code:", err.errno)                # Numeric error code
        cnx.rollback() 
        cnx.close()
        return {
            "success" : False,
            "message" : f' server error: {err.errno}' 
        }  
#------------------------------------------------------------------------------
# as long as deletes happen, dont need to change anything else,order will still
# be maintained, just not with gaps of 1 
#------------------------------------------------------------------------------
def deleteExerciseOrder(idWorkout, idExercise):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
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
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }   
#------------------------------------------------------------------------------
def updateExerciseOrder(idWorkout, idExercise, orderNumber):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
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
            print("MySQL Error:", err)    
            print("Error code:", err.errno)                
            cnx.rollback() 
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }   
#------------------------------------------------------------------------------
def insertNewExerciseIntoWorkout(setData):

    idExercise  = setData["idExercise"]
    idWorkout   = setData["idWorkout"]
    SetNumber   = setData["SetNumber"]

    cnx = connect()
    if (cnx.is_connected()):
        try:
            cnx.start_transaction(isolation_level='READ COMMITTED')
            with cnx.cursor(dictionary=True, buffered=True) as cursor:
                # new exercise need update the totallifetime 
                # number of exercises in this workout
                cursor.execute(
                    '''
                    UPDATE 
                        `Workout` 
                    SET 
                        `numberOfLifts` = numberOfLifts + 1 
                    WHERE 
                        idWorkout = %s;
                    '''
                    ,(idWorkout,))
        
                # get result form above 
                cursor.execute(
                    '''
                    SELECT 
                        numberOfLifts as num
                    FROM 
                        Workout 
                    WHERE 
                        idWorkout = %s;
                    ''', (idWorkout,))
                
                row = cursor.fetchone()
                if row is None:
                    raise Exception(f"No Workout row found for idWorkout={idWorkout}")
                order = row['num']
                
                cursor.execute(
                    '''
                    INSERT INTO 
                        `ExerciseOrderInWorkout` (idExercise, idWorkout, `Order`)
                    VALUES 
                        (%s, %s, %s);
                    ''', 
                    (idExercise, idWorkout, order))
                
                # then the exercise set info
                cursor.execute(
                    '''
                    INSERT into `Set`
                        (idExercise, idWorkout, SetNumber)
                    VALUES 
                        (%s, %s, %s)
                    ''', 
                    (idExercise, idWorkout, SetNumber))
        
                newSetID = cursor.lastrowid
                # then get all the setInfo returned back 
                cursor.execute(
                    '''
                    SELECT * FROM `Set`
                    WHERE idSet = %s
                    ''',
                    (newSetID,))
                newSet = cursor.fetchall()
                cnx.commit()
                return  newSet
        except mysql.connector.Error as err:
            print("MySQL Error:", err)    
            print("Error code:", err.errno)              
            cnx.rollback() 
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }       
#------------------------------------------------------------------------------
def createSet(setData):
    idExercise  = setData["idExercise"]
    idWorkout   = setData["idWorkout"]
    SetNumber   = setData["SetNumber"]

    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True)
            cnx.start_transaction()
            cursor.execute(
                '''
                INSERT into `Set`
                    (idExercise, idWorkout, SetNumber)
                VALUES 
                    (%s, %s, %s)
                ''', 
                (idExercise, idWorkout, SetNumber))
   
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
            cnx.commit()
            cursor.close()
            cnx.close()
            return newSet
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
#------------------------------------------------------------------------------
def deleteSet(setID, idWorkout, idExercise):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cnx.start_transaction()
            cursor.execute(
                '''
                DELETE from `Set`
                WHERE idSet = %s
                ''', (setID,))
            # When we delete a set from a workout (idSet)
            # We need to ask, does this workout (idWorkout) still contain 
            # Sets that have that particular exercise (idExercise).
            # If they dont, we need to delete that exercise 
            # from the EOW (idExercise, idWorkout) table. 
            cursor.execute(
                '''
                SELECT * FROM 
                    `Set` s
                WHERE
                    s.idExercise = %s AND s.idWorkout = %s
                ''',
                (idExercise, idWorkout)
            )
            sets = cursor.rowcount
            if sets == 0:
                print("no sets of this exercise remain, deleting from EOW table")
                cursor.execute(
                    '''
                    DELETE from `ExerciseOrderInWorkout` eow
                    WHERE eow.idExercise = %s AND eow.idWorkout = %s
                    ''',
                    (idExercise,idWorkout))
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"success" : True }   
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
#------------------------------------------------------------------------------
def updateSet(updateInfo):

    idSet     = updateInfo["idSet"]
    setWeight = updateInfo["setWeight"]
    setReps   = updateInfo["setReps"]
    setRPE    = updateInfo["setRPE"]
    paused    = updateInfo["paused"]
    belt      = updateInfo["belt"]
    workingSet= updateInfo["workingSet"]
    unilateral= updateInfo["unilateral"]

    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            UPDATE
                `Set`
            SET
                setWeight = %s,
                setReps = %s,
                setRPE = %s,
                paused = %s,
                belt = %s,
                workingSet = %s,
                unilateral = %s
            WHERE 
                idSet = %s
            ''', 
                (setWeight, setReps, setRPE, paused, belt, workingSet, unilateral, idSet) )
            cnx.commit()
            cursor.close()
            cnx.close()
            returnObj = {
                    "setWeight":setWeight, 
                    "setReps":setReps, 
                    "setRPE":setRPE,
                    "idSet":idSet,
                    "paused" : paused,
                    "belt" : belt, 
                    "workingSet" : workingSet, 
                    "unilateral" : unilateral
                }
            return returnObj
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
#------------------------------------------------------------------------------          
def reorderSetNumbers(idWorkout, idExercise):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cnx.start_transaction()
               # select all sets for this workout & exercise, ordered by set #
            cursor.execute(
            """
                SELECT idSet
                FROM `Set`
                WHERE idWorkout = %s AND idExercise = %s
                ORDER BY `SetNumber` ASC;
            """, (idWorkout, idExercise))
            sets = cursor.fetchall()

            for i, row in enumerate(sets, start=1):      # reassign set numbers
                idSet = row[0] #only one value, the setID in the returned tuple
                cursor.execute(
                """
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
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
#------------------------------------------------------------------------------
def getWorkoutFromID(idWorkout):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True)
            cursor.execute(
                '''
                SELECT 
                    e.abbreviation AS exercise,
                    e.idExercise AS exerciseID,
                    eow.Order AS exerciseOrder,
                    s.idSet AS setID,
                    s.SetNumber AS `set`,
                    s.idWorkout AS idWorkout,
                    s.setWeight AS weight,
                    s.setReps AS reps,
                    s.setRPE AS rpe,
                    s.paused AS paused,
                    s.belt AS belt,
                    s.workingSet AS workingSet,
                    s.unilateral AS unilateral,
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
            ''', (idWorkout,))

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
                        "idWorkout"         : lift["idWorkout"],
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
                    "belt"      : lift["belt"],
                    "workingSet": lift["workingSet"],
                    "unilateral": lift["unilateral"],
                    "comment"   : lift["comment"],
                    "videoLink" : lift["videoLink"]
                }
                unique_lifts_in_workout[lift_id]["sets"].append(set_info)

            return lifts

        
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
#------------------------------------------------------------------------------
def createNewWorkout(Date, userID):
    cnx = connect()
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
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
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
#------------------------------------------------------------------------------
def getDaysTrained(userID, Date):
    cnx = connect()
    workouts = []
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True)   
            cursor.execute(
            '''
            SELECT 
                DAY(w.Date) AS day,
                w.idWorkout,
                e.ExerciseName,
                e.ExerciseCategory
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
        except mysql.connector.Error as err:
            print("MySQL Error:", err)    # This will show you the exact error
            print("Error code:", err.errno)               # Numeric error code
            cnx.rollback() 
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
#------------------------------------------------------------------------------
def getLifterInfo(lifterID):
    cnx = connect()
    user = "not found"
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True)   # dic = format for JSON objects
            cursor.execute('''SELECT * FROM User WHERE idUser = %s''', (lifterID,))
            user = cursor.fetchone()
            cursor.close()
            cnx.close()
            return user
        except mysql.connector.Error as err:
            print("MySQL Error:", err)    # This will show you the exact error
            print("Error code:", err.errno)               # Numeric error code
            cnx.rollback() 
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
#------------------------------------------------------------------------------
def getLifters():
    cnx = connect();
    users = []
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True)  
            cursor.execute('SELECT * FROM User')
            users = cursor.fetchall()
            cursor.close()
            cnx.close()
            return users
        except mysql.connector.Error as err:
            print("MySQL Error:", err)    # This will show you the exact error
            print("Error code:", err.errno)               # Numeric error code
            cnx.rollback() 
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
#------------------------------------------------------------------------------
def postNewLifter(newLifter):
    cnx = connect()
    Email       = newLifter["Email"]
    userFirst   = newLifter["userFirst"]
    userLast    = newLifter["userLast"]
    userName    = newLifter["userName"]
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
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
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
#------------------------------------------------------------------------------
def removeLifter(lifterID):
    cnx = connect()
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
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
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
#------------------------------------------------------------------------------
def getExerciseInfo(idExercise):
    cnx = connect()
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute('''
                SELECT 
                    e.ExerciseName AS lift,
                    e.abbreviation AS abbrev,
                    e.ExerciseCategory AS category
                FROM 
                    `Exercise` e
                WHERE idExercise = %s
                ''',
                (idExercise,)
            )
            exerciseInfo = cursor.fetchone()
            cnx.commit()
            cnx.close()
            return exerciseInfo 
        except mysql.connector.Error as err:
            print("MySQL Error:", err)    # This will show you the exact error
            print("Error code:", err.errno)               # Numeric error code
            cnx.rollback() 
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            } 
    pass
#------------------------------------------------------------------------------


load_dotenv()