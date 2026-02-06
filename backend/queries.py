#------------------------------------------------------------------------------
import mysql.connector # pyright: ignore[reportMissingImports]
from dotenv import load_dotenv # type: ignore
import os
from werkzeug.security import generate_password_hash, check_password_hash #type: ignore
#------------------------------------------------------------------------------
load_dotenv()
#------------------------------------------------------------------------------
def connect():
    return mysql.connector.connect(
        user=os.getenv('DB_USER'), 
        password=os.getenv('DB_PASSWORD'), 
        database=os.getenv('DB_NAME'),
        host=os.getenv('DB_HOST', 'localhost') )
#------------------------------------------------------------------------------
def getGroupChatIds(idUser):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute(
            '''
            SELECT 
                *
            FROM 
                ConversationParticipant cp
            JOIN
                Conversation c
            ON
                cp.idConversation = c.idConversation
            WHERE
                c.type = 'group'
            AND 
                cp.idUser = %s
            ''', 
                (idUser,) 
            )
            groupChatIds = cursor.fetchall()
            return groupChatIds
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
        finally:
            if cursor:
                cursor.close()
            cnx.close()  
#------------------------------------------------------------------------------
def getConvoTitle(idConversation):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute(
            '''
            SELECT 
                c.Title from Conversation c
            WHERE 
                c.idConversation = %s

            ''', 
                (idConversation,) 
            )
            users = cursor.fetchone()
            return users
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
        finally:
            if cursor:
                cursor.close()
            cnx.close()  
#------------------------------------------------------------------------------
def getUsersInConversation(idConversation):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute(
            '''
            SELECT 
                *
            FROM 
                User u
            JOIN 
                ConversationParticipant c
            ON
                u.Iduser = c.idUser
            WHERE 
                c.idConversation = %s

            ''', 
                (idConversation,) 
            )
            users = cursor.fetchall()
            return users
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
        finally:
            if cursor:
                cursor.close()
            cnx.close()        
#------------------------------------------------------------------------------
def getLastMsgInConversation(idConversation, idUser):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute(
            '''
            SELECT
                m.idMessage,
                m.idSender,
                m.message,
                m.msgDate,
                c.lastReadAt AS lastReadDate
            FROM 
                Message m
            JOIN 
                ConversationParticipant c
                ON m.idConversation = c.idConversation
            WHERE 
                m.idConversation = %s
            AND 
                c.idUser = %s
            ORDER BY 
                m.msgDate DESC
            LIMIT 1;
            ''', 
                (idConversation, idUser) 
            )
            messages = cursor.fetchone()
            return messages
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
        finally:
            if cursor:
                cursor.close()
            cnx.close()       
#------------------------------------------------------------------------------
def updateLastReadAt(idConversation,idReader):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            UPDATE ConversationParticipant
            SET lastReadAt = GREATEST(
                COALESCE(lastReadAt, '1970-01-01'),
                NOW()
            )
            WHERE idConversation = %s
            AND idUser = %s
            ''', 
                (idConversation, idReader) )
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"success" : True}, 200
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
def sendMsg(idConversation, idSender, message):
    cnx = connect()
    if not cnx.is_connected():
        return None
    try:
        cursor = cnx.cursor(dictionary=True)
        cursor.execute(
            '''
            INSERT INTO Message (idConversation, idSender, message) VALUES (%s, %s, %s);
            ''',
            (idConversation, idSender, message)
        )
        idMessage = cursor.lastrowid
        cnx.commit()
        return {
            "idMessage": idMessage,
            "idConversation": idConversation,
            "idSender": idSender,
            "message": message
        }
    except mysql.connector.Error as err:
        cnx.rollback()
        print("MySQL Error:", err)
        return {
            "success": False,
            "message": str(err)
        }
    finally:
        cursor.close()
        cnx.close() 
#------------------------------------------------------------------------------
def getConversationMessages(idConversation):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute(
            '''
            SELECT
                m.idMessage,
                m.idConversation,
                m.idSender,
                u.userName AS senderName,
                m.message,
                m.msgDate,
                c.lastReadAt AS lastRead
            FROM 
                Message m
            JOIN 
                User u
                ON m.idSender = u.idUser
            JOIN 
                ConversationParticipant c
                ON m.idConversation = c.idConversation
            AND m.idSender = c.idUser
            WHERE 
                m.idConversation = %s
            ORDER BY 
                m.msgDate ASC;
            ''', 
                (idConversation,) 
            )
            messages = cursor.fetchall()
            return messages
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
        finally:
            if cursor:
                cursor.close()
            cnx.close()       
#------------------------------------------------------------------------------
def createGroupConversation(participants, createdBy, title="New Group Chat"):
    cnx = connect()
    try:
        cursor = cnx.cursor(dictionary=True)

        n = len(participants)
        placeholders = ",".join(["%s"] * n)

        # 1. Look for existing exact group
        cursor.execute(
            f"""
            SELECT cp.idConversation
            FROM ConversationParticipant cp
            JOIN Conversation c
              ON c.idConversation = cp.idConversation
            WHERE c.type = 'group'
              AND cp.idUser IN ({placeholders})
            GROUP BY cp.idConversation
            HAVING
              COUNT(DISTINCT cp.idUser) = %s
              AND (
                SELECT COUNT(*)
                FROM ConversationParticipant cp2
                WHERE cp2.idConversation = cp.idConversation
              ) = %s
            LIMIT 1
            """,
            participants + [n, n]
        )

        row = cursor.fetchone()
        if row:
            return row["idConversation"]

        # 2. Create new group (NO start_transaction needed)
        cursor.execute(
            """
            INSERT INTO Conversation (type, title, createdBy)
            VALUES ('group', %s, %s)
            """,
            (title, createdBy)
        )
        groupId = cursor.lastrowid

        cursor.executemany(
            """
            INSERT INTO ConversationParticipant (idConversation, idUser)
            VALUES (%s, %s)
            """,
            [(groupId, uid) for uid in set(participants)]
        )

        cnx.commit()
        return groupId

    finally:
        cursor.close()
        cnx.close()
#------------------------------------------------------------------------------
def addUserToExistingGroup(groupConversationId, newUserId):
    cnx = connect()
    try:
        cursor = cnx.cursor()
        cursor.execute(
            """
            INSERT IGNORE INTO ConversationParticipant (idConversation, idUser)
            VALUES (%s, %s)
            """,
            (groupConversationId, newUserId)
        )
        cnx.commit()
        return True
    finally:
        cursor.close()
        cnx.close()
#------------------------------------------------------------------------------
def createConversation(idSender, idRecipient):
    cnx = connect()
    if not cnx.is_connected():
        return None

    try:
        cursor = cnx.cursor(dictionary=True)
        # Create conversation
        cursor.execute(
            """
            INSERT INTO Conversation (type, createdBy)
            VALUES ('dm', %s)
            """,
            (idSender,)
        )
        idConversation = cursor.lastrowid
        # Add participants
        cursor.execute(
            """
            INSERT INTO ConversationParticipant (idConversation, idUser)
            VALUES (%s, %s), (%s, %s);
            """,
            (idConversation, idSender,
             idConversation, idRecipient)
        )
        cnx.commit()
        return idConversation
    except mysql.connector.Error as err:
        cnx.rollback()
        print("MySQL Error:", err)
        return {
            "success": False,
            "message": str(err)
        }
    finally:
        cursor.close()
        cnx.close() 
#------------------------------------------------------------------------------
def getConversationId(idUser1, idUser2):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute(
            '''
                SELECT c.idConversation
                FROM Conversation c
                JOIN ConversationParticipant cp1
                ON c.idConversation = cp1.idConversation
                JOIN ConversationParticipant cp2
                ON c.idConversation = cp2.idConversation
                WHERE c.type = 'dm'
                AND cp1.idUser = %s
                AND cp2.idUser = %s
                LIMIT 1;
            ''', 
                (idUser1, idUser2) 
            )
            result = cursor.fetchone()
            return result
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
        finally:
            if cursor:
                cursor.close()
            cnx.close()      
#------------------------------------------------------------------------------
def getMode(idUser):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute(
            '''
                SELECT 
                    u.isLightMode as mode
                FROM 
                    `User` u
                WHERE 
                    idUser = %s;
            ''', 
                (idUser,) 
            )
            result = cursor.fetchone()
            return result
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
        finally:
            if cursor:
                cursor.close()
            cnx.close()  
#------------------------------------------------------------------------------
def setMode(mode, idUser):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            UPDATE
                `User`
            SET
                `isLightMode` = %s
            WHERE 
                idUser = %s
            ''', 
                (mode, idUser) )
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"success" : True}, 200
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
def getTrackedLifts(idUser):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute(
            '''
                SELECT 
                    u.idExercise as idExercise,
                    u.dateAdded as dateAdded
                FROM 
                    `UserTrackedExercise` u
                WHERE 
                    idUser = %s;
            ''', 
                (idUser,) 
            )
            result = cursor.fetchall()
            return result
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
        finally:
            if cursor:
                cursor.close()
            cnx.close()    
#------------------------------------------------------------------------------
def addExerciseToTrackedLifts(idUser, idExercise):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            INSERT INTO `UserTrackedExercise` (idUser, idExercise)
                VALUES (%s, %s)
            ''', 
                (idUser, idExercise) )
            cnx.commit()
            cursor.close()
            return {"success" : True}, 200
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
        finally:
            if cursor:
                cursor.close()
            cnx.close()
#------------------------------------------------------------------------------
def removeExerciseFromTrackedLifts(idUser, idExercise):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
                DELETE from `UserTrackedExercise`
                WHERE idUser = %s AND idExercise = %s; 
            ''', 
                (idUser, idExercise) )
            cnx.commit()
            cursor.close()
            return {"success" : True}, 200
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }  
        finally:
            if cursor:
                cursor.close()
            cnx.close()
#------------------------------------------------------------------------------
def getPRDataForLift(idUser, idExercise):
    try:
        cnx = connect()
        cursor = cnx.cursor(dictionary=True, buffered=True)
        cursor.execute(
            '''
                SELECT 
                    s.idSet AS idSet,
                    s.setWeight AS weight,
                    s.setUnit AS unit,
                    s.setReps AS reps,
                    w.Date AS date,
                    w.idWorkout AS idWorkout,
                    e.ExerciseName AS exerciseName,
                    e.idExercise AS idExercise,

                    CASE 
                        WHEN s.setUnit = 'kg'  THEN s.setWeight * 2.20462
                        WHEN s.setUnit = 'lbs' THEN s.setWeight
                        ELSE NULL
                    END AS weight_lbs

                FROM `Set` s
                JOIN `Workout` w ON s.idWorkout = w.idWorkout
                JOIN `Exercise` e ON s.idExercise = e.idExercise
                WHERE e.idExercise = %s 
                AND w.idUser = %s
                ORDER BY reps ASC, weight_lbs DESC;
            ''', 
            (idExercise, idUser))
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
def update_workout_title(idWorkout, title):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            UPDATE
                `Workout`
            SET
                workoutTitle = %s
            WHERE 
                idWorkout = %s
            ''', 
                (title, idWorkout) )
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"success" : True}, 200
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
def update_set_setNum(idSet, setNum):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            UPDATE
                `Set`
            SET
                SetNumber = %s
            WHERE 
                idSet = %s
            ''', 
                (setNum, idSet) )
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"success" : True}, 200
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
def update_set_Unit(idSet, unit):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            UPDATE
                `Set`
            SET
                setUnit = %s
            WHERE 
                idSet = %s
            ''', 
                (unit, idSet) )
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"success" : True}, 200
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
def update_set_RPE(idSet, rpe):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            UPDATE
                `Set`
            SET
                setRPE = %s
            WHERE 
                idSet = %s
            ''', 
                (rpe, idSet) )
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"success" : True}, 200
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
def update_set_reps(idSet, reps):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            UPDATE
                `Set`
            SET
                setReps = %s
            WHERE 
                idSet = %s
            ''', 
                (reps, idSet) )
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"success" : True}, 200
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
def update_set_weight(idSet, weight):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            UPDATE
                `Set`
            SET
                setWeight = %s
            WHERE 
                idSet = %s
            ''', 
                (weight, idSet) )
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"success" : True}, 200
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
def update_set_note(idSet, note):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
            '''
            UPDATE
                `Set`
            SET
                setComment = %s
            WHERE 
                idSet = %s
            ''', 
                (note, idSet) )
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"success" : True}, 200
        except mysql.connector.Error as err:
            print("MySQL Error:", err)     # This will show you the exact error
            print("Error code:", err.errno)                # Numeric error code
            cnx.rollback() 
            cnx.close()
            return {
                "success" : False,
                "message" : f' server error: {err.errno}' 
            }, 500
#------------------------------------------------------------------------------
def get_workouts_in_date_range(idUser, date1, date2):
    try:
        cnx = connect()
        cursor = cnx.cursor(dictionary=True)
        cursor.execute(
            '''
            SELECT 
                w.idWorkout,
                w.Date,
                w.workoutTitle,
                w.sessionNote,
                e.idExercise,
                e.ExerciseName AS exercise,
                e.ExerciseCategory AS category,
                eow.Order AS exerciseOrder,
                s.idSet,
                s.SetNumber AS setNumber,
                s.setWeight AS weight,
                s.setUnit AS unit,
                s.setReps AS reps,
                s.setRPE AS rpe,
                s.paused,
                s.belt,
                s.workingSet,
                s.unilateral,
                s.setComment AS note,
                s.setVideo AS videoLink
            FROM Workout w
            LEFT JOIN ExerciseOrderInWorkout eow ON w.idWorkout = eow.idWorkout
            LEFT JOIN Exercise e ON e.idExercise = eow.idExercise
            LEFT JOIN `Set` s ON s.idWorkout = w.idWorkout AND s.idExercise = e.idExercise
            WHERE 
                w.idUser = %s
                AND w.Date >= %s
                AND w.Date < DATE_ADD(%s, INTERVAL 1 DAY)
            ORDER BY 
                w.Date ASC, w.idWorkout, eow.Order ASC, s.SetNumber ASC
            ''',
            (idUser, date1, date2)
        )
        rows = cursor.fetchall()
        cursor.close()
        cnx.close()

        # Group in Python
        workouts = {}
        for row in rows:
            wid = row["idWorkout"]
            if wid not in workouts:
                workouts[wid] = {
                    "idWorkout": wid,
                    "date": row["Date"],
                    "workoutTitle": row["workoutTitle"],
                    "note": row["sessionNote"],
                    "lifts": []
                }

            lifts_map = {l["idExercise"]: l for l in workouts[wid]["lifts"]}
            ex_id = row["idExercise"]

            if ex_id not in lifts_map:
                lift_info = {
                    "idExercise": ex_id,
                    "exercise": row["exercise"],
                    "exerciseOrder": row["exerciseOrder"],
                    "category": row["category"],
                    "sets": []
                }
                workouts[wid]["lifts"].append(lift_info)
                lifts_map[ex_id] = lift_info

            lifts_map[ex_id]["sets"].append({
                "idSet": row["idSet"],
                "setNumber": row["setNumber"],
                "weight": row["weight"],
                "unit": row["unit"],
                "reps": row["reps"],
                "rpe": row["rpe"],
                "paused": row["paused"],
                "belt": row["belt"],
                "workingSet": row["workingSet"],
                "unilateral": row["unilateral"],
                "note": row["note"],
                "videoLink": row["videoLink"]
            })

        return list(workouts.values())

    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return []
#------------------------------------------------------------------------------   
def login(userName, pwd):

    try:
        cnx = connect()
        cursor = cnx.cursor(buffered=True, dictionary=True)
        cursor.execute(
        '''
        SELECT
            *
        FROM 
            User
        WHERE 
            userName = %s 
        AND 
            passwordHash = %s
        ''',
            (userName, pwd)
        )
        user = cursor.fetchone()

        if not user:
            print('no user')
            return None
        
        cursor.execute(
            '''
            UPDATE
                `User`
            SET
                isLoggedIn = 1
            WHERE 
                idUser = %s 
            ''',
            (user["idUser"], )
        )
        cnx.commit()

        # if check_password_hash(user["passwordHash"], password):
        #     return user

        return user

    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return None
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()
#------------------------------------------------------------------------------   
def logout(idUser):
    try:
        cnx = connect()
        cursor = cnx.cursor()
        cursor.execute(
        '''
        UPDATE
            `User`
        SET
            isLoggedIn = 0
        WHERE 
            idUser = %s 
        ''',
            (idUser, )
        )
        cnx.commit()
        return True
    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return None
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()
#------------------------------------------------------------------------------
def setVideoLink(link, idSet):
    try:
        cnx = connect()
        cursor = cnx.cursor(dictionary=True, buffered=True)
        cursor.execute(
            '''
            UPDATE
                `Set` s
            Set 
                s.setVideo = %s
            WHERE
                s.idSet = %s
            ''', 
            (link, idSet))
        cnx.commit()
        cursor.close()
        cnx.close()
        return link
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
def addExerciseToWorkout(data):

    idExercise  = data["idExercise"]
    idWorkout   = data["idWorkout"]

    cnx = connect()
    try:
        cnx.start_transaction()

        with cnx.cursor(dictionary=True) as cursor:
            # Get next order
            cursor.execute("""
                SELECT COALESCE(MAX(`Order`), 0) + 1 AS nextOrder
                FROM ExerciseOrderInWorkout
                WHERE idWorkout = %s
            """, (idWorkout,))
            order = cursor.fetchone()["nextOrder"]

            # Insert exercise into workout
            cursor.execute("""
                INSERT INTO ExerciseOrderInWorkout (idExercise, idWorkout, `Order`)
                VALUES (%s, %s, %s)
            """, (idExercise, idWorkout, order))

            # Optional: create first set
            cursor.execute("""
                INSERT INTO `Set` (SetNumber, idExercise, idWorkout)
                VALUES (1, %s, %s)
            """, (idExercise, idWorkout))

            newSetId = cursor.lastrowid

            cnx.commit()

            return {
                "success": True,
                "idWorkout": idWorkout,
                "idExercise": idExercise,
                "order": order,
                "firstSetId": newSetId
            }

    except mysql.connector.Error as err:
        cnx.rollback()
        return {"success": False, "error": str(err)}
    
    finally:
        cnx.close()
#------------------------------------------------------------------------------
def addSet(setNumber, idWorkout, idExercise):
 
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
                (idExercise, idWorkout, setNumber))
   
            newidSet = cursor.lastrowid
            newidSet = cursor.lastrowid
            # then get all the setInfo returned back 
            cursor.execute(
                '''
                SELECT * FROM `Set`
                WHERE idSet = %s
                ''',
                (newidSet,))
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
def deleteSet(idSet, idWorkout, idExercise):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cnx.start_transaction()
            cursor.execute(
                '''
                DELETE from `Set`
                WHERE idSet = %s
                ''', (idSet,))
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
                idSet = row[0] #only one value, the idSet in the returned tuple
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
                    e.idExercise AS idExercise,
                    e.ExerciseCategory AS category,
                    w.workoutTitle AS sessionTitle,
                    eow.Order AS exerciseOrder,
                    s.idSet AS idSet,
                    s.SetNumber AS setNumber,
                    s.idWorkout AS idWorkout,
                    s.setWeight AS weight,
                    s.setUnit AS unit,
                    s.setReps AS reps,
                    s.setRPE AS rpe,
                    s.paused AS paused,
                    s.belt AS belt,
                    s.workingSet AS workingSet,
                    s.unilateral AS unilateral,
                    s.setComment AS comment,
                    s.setVideo AS videoLink,
                    w.sessionNote AS note
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
                lift_id = lift["idExercise"]
                if lift_id not in unique_lifts_in_workout:
                    # all non set info
                    lift_info = {
                        "exercise"          : lift["exercise"],
                        "idExercise"        : lift_id,
                        "exerciseOrder"     : lift["exerciseOrder"],
                        "idWorkout"         : lift["idWorkout"],
                        "note"              : lift["note"],
                        "category"          : lift["category"],
                        "sessionTitle"      : lift["sessionTitle"],
                        "sets"              : [] 
                    }
                    unique_lifts_in_workout[lift_id] = lift_info
                    lifts.append(lift_info) 
                
                    set_info = {
                        "idSet"     : lift["idSet"],
                        "setNumber" : lift["setNumber"],
                        "weight"    : lift["weight"],
                        "unit"      : lift["unit"],
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
def createNewWorkout(date, idUser):
    cnx = connect()
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute('''
                INSERT INTO Workout (Date, idUser)
                VALUES (%s, %s);
                ''',
                (date, idUser))
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
            cursor.execute('' \
            '''SELECT 
                    idUser, userName, userFirst, userLast, Email, isAdmin, isCoach, coachedBy
               FROM 
                    User 
                WHERE 
                    idUser = %s''', (lifterID,))
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
    cnx = connect()
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
    password    = newLifter["password"]
    password    = generate_password_hash(password)
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute('''
                INSERT INTO User 
                (userName, passwordHash, userFirst, userLast, Email)
                VALUES(%s,%s,%s,%s,%s)''', 
                (userName, password, userFirst, userLast, Email)
            )
            cursor.close()
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
                "message" : f' server error: {err}' 
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
            cursor.close()
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
            cursor.close()
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
#------------------------------------------------------------------------------
def saveSessionNote(idWorkout, note):
    cnx = connect()
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute('''
                UPDATE 
                    `Workout`w
                SET 
                    w.sessionNote = %s
                WHERE idWorkout = %s
                ''',
                (note, idWorkout)
            )
            cursor.close()
            cnx.commit()
            cnx.close()
            return "success" 
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
def updateSessionName(idWorkout, newTitle):
    cnx = connect()
    if(cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True, dictionary=True)
            cursor.execute('''
                UPDATE 
                    `Workout` w
                SET 
                    w.workoutTitle = %s
                WHERE idWorkout = %s
                ''',
                (newTitle, idWorkout)
            )
            cursor.close()
            cnx.commit()
            cnx.close()
            return "success" 
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
# def login(loginData):
#     userName = loginData['userName']
#     passWord = loginData['password']
#     cnx = connect()
#     if(cnx.is_connected()):
#         try:
#             cursor = cnx.cursor(buffered=True, dictionary=True)
#             cursor.execute('''
#                 SELECT 
#                     u.passwordHash AS pHash
#                 FROM
#                     `User` u
#                 WHERE 
#                     u.userName = %s
#                 ''',
#                 (userName,)
#             )
#             hashedPassword = cursor.fetchone()['pHash']
#             cnx.close()
#             valid = check_password_hash(hashedPassword, passWord)
#             if (valid):
#                 return {"message" : "success"}
#             return {"message" : "password incorrect"}
#         except mysql.connector.Error as err:
#             print("MySQL Error:", err)    # This will show you the exact error
#             print("Error code:", err.errno)               # Numeric error code
#             cnx.rollback() 
#             cnx.close()
#             return {
#                 "success" : False,
#                 "message" : f' server error: {err.errno}' 
#             } 
#------------------------------------------------------------------------------
def getUserByUserName(userName):
    cnx = connect()
    user = "not found"
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    SELECT 
                        idUser, userName, userFirst, userLast, Email, isAdmin, isCoach, coachedBy
                    FROM 
                        User 
                    WHERE 
                        userName = %s''', (userName,))
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
def searchForLifter(partialInput):
    cnx = connect()
    users = "not found"
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    SELECT 
                        idUser, userName, userFirst, userLast, Email, isAdmin, isCoach, coachedBy
                    FROM 
                        User 
                    WHERE 
                        userName LIKE %s''', (partialInput + '%',))
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
def doIfollowLifter(followerID, followeeID):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    SELECT * FROM `UserFollows` u
                    WHERE u.followerID = %s AND u.followeeID = %s
                ''', (followerID, followeeID))
            follow = cursor.fetchone()
            cursor.close()
            cnx.close()
            return follow
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
def followLifter(followerID, followeeID):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    INSERT INTO 
                        `UserFollows` (followerID, followeeID)
                    VALUES  
                        (%s, %s)
                ''', (followerID, followeeID))
            cnx.commit()
            cursor.close()
            cnx.close()
            return { "message" : "success" }
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
def unfollowLifter(followerID, followeeID):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    DELETE FROM 
                        `UserFollows` 
                    WHERE  
                        followerID = %s AND followeeID = %s
                ''', (followerID, followeeID))
            cnx.commit()
            cursor.close()
            cnx.close()
            return { "message" : "success" }
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
def getLiftersIfollow(idLifter):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    SELECT 
                        u.idUser, u.userName, u.userFirst, u.userLast, u.Email, u.isAdmin, u.isCoach, u.coachedBy
                    FROM
                        UserFollows uf
                    JOIN 
                        User u ON uf.followeeID = u.idUser
                    WHERE
                         uf.followerID = %s
                ''', (idLifter,))
            cnx.commit()
            liftersIfollow = cursor.fetchall()
            cursor.close()
            cnx.close()
            return liftersIfollow
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
def sendSetMessage(idCommenter, commentText, idSet):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    INSERT INTO 
                        `setMessages` (idSender, idSet, message)
                    VALUES  
                        (%s, %s, %s)
                ''', (idCommenter, idSet, commentText))
            cnx.commit()
            cursor.close()
            cnx.close()
            return { "message" : "success" }
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
def getSetMsgs(idSet):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    SELECT 
                        sm.idMessage, sm.msgDate, sm.message, u.idUser, u.userName, u.userFirst, u.userLast, u.Email, u.isAdmin, u.isCoach, u.coachedBy
                    FROM
                        setMessages sm
                    JOIN 
                        User u ON sm.idSender = u.idUser
                    WHERE
                        sm.idSet = %s
                ''', (idSet,))
            cnx.commit()
            liftersIfollow = cursor.fetchall()
            cursor.close()
            cnx.close()
            return liftersIfollow
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
def removeSetMsg(idMessage):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(buffered=True)
            cursor.execute(
                '''
                DELETE from `setMessages`
                WHERE idMessage = %s;
                ''', 
                (idMessage,))
            cnx.commit()
            cursor.close()
            cnx.close()
            return {"message" : "success"}
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
def isMyCoach(idUser, potentialCoachID):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    SELECT 
                        u.coachedBy
                    FROM
                        `User` u
                    WHERE
                        u.idUser = %s
                ''', (idUser,))
            res = cursor.fetchone()
            cursor.close()
            cnx.close()
            return res['coachedBy'] == potentialCoachID
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
def setCoach(clientID, coachID):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
            UPDATE
                `User` u
            Set 
                u.coachedBy = %s
            WHERE
                u.idUser = %s
                ''', (coachID, clientID))
            cnx.commit()
            cursor.close()
            cnx.close()
            return { "message" : "success" }
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
def amItheirCoach(coachID, potentialClientID):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    SELECT 
                        u.coachedBy
                    FROM
                        `User` u
                    WHERE
                        u.idUser = %s
                ''', (potentialClientID,))
            res = cursor.fetchone()
            cursor.close()
            cnx.close()
            print(res['coachedBy'] == coachID)
            return res['coachedBy'] == coachID
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
def getMyAthletes(idUser):
    cnx = connect()
    if (cnx.is_connected()):
        try:
            cursor = cnx.cursor(dictionary=True, buffered=True) 
            cursor.execute(
                '''
                    SELECT 
                        u.idUser, u.userName, u.userFirst, u.userLast, u.Email, u.isAdmin, u.isCoach, u.coachedBy
                    FROM
                        `User` u
                    WHERE
                        u.coachedBy = %s
                ''', (idUser,))
            athletesIcoach = cursor.fetchall()
            cursor.close()
            cnx.close()
            return athletesIcoach
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
load_dotenv()