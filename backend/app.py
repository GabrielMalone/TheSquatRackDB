from flask import Flask, request, jsonify, send_file # pyright: ignore[reportMissingImports]
from flask_cors import CORS, cross_origin # pyright: ignore[reportMissingModuleSource]
import queries
from flask_socketio import SocketIO, emit, join_room # type: ignore
import os
import threading
#------------------------------------------------------------
app = Flask(__name__)
CORS(app)
#------------------------------------------------------------
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
@socketio.on("connect")
def handle_connect():
    print("client_connected on thread: ", threading.get_ident())
#------------------------------------------------------------
@socketio.on("disconnect")
def handle_disconnect():
    print("client disconnected")
#------------------------------------------------------------
# can use this for force logout everywhere 
@socketio.on("register_user")
def register_user(data):
    idUser = data.get("idUser")
    print(f"welcome user id{idUser}")
    join_room(f"user:{idUser}")
#------------------------------------------------------------
@socketio.on("join_conversation")
def join_conversation(data):
    idConversation = data.get("idConversation")
    join_room(f"conv:{idConversation}")
#------------------------------------------------------------
@socketio.on("typingInChat")
def handle_typing(data):
    idUserTyping = data["idUserTyping"]
    idUserRecipient = data["idUserRecipient"]
    isTyping = data["isTyping"]
    emit(
        "user_typing_in_chat",
        {
            "idUserRecipient": idUserRecipient,
            "idUserTyping" : idUserTyping,
            "isTyping": isTyping,
        },
        room=f"user:{idUserRecipient}",
        include_self=False
    )
#------------------------------------------------------------
@socketio.on("typingInChatUserList")
def handle_typing_for_user_list(data):
    idUserTyping = data["idUserTyping"]
    idUserRecipient = data["idUserRecipient"]
    isTyping = data["isTyping"]
    emit(
        "user_typing_user_list",
        {
            "idUserTyping": idUserTyping,
            "isTyping": isTyping,
        },
        room=f"user:{idUserRecipient}",
        include_self=False
    )  
#------------------------------------------------------------
UPLOAD_ROOT = "uploads/users"
#------------------------------------------------------------
@app.route("/getWorkoutsInDateRange", methods=["GET"])
def getWorkoutsInDateRange():
    idUser = request.args.get("idUser")
    date1  = request.args.get("date1")
    date2  = request.args.get("date2")
    res = queries.get_workouts_in_date_range(idUser, date1, date2);
    return jsonify(res)
#------------------------------------------------------------
@app.route("/updateSetNote", methods=["POST"])
def updateSetNote():
    data    = request.get_json()
    idSet   = data["idSet"]
    note    = data["note"]
    res = queries.update_set_note(idSet, note)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/updateSetWeight", methods=["POST"])
def updateSetWeight():
    data    = request.get_json()
    idSet   = data["idSet"]
    weight  = data["weight"]
    res = queries.update_set_weight(idSet, weight)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/updateSetReps", methods=["POST"])
def updateSetReps():
    data    = request.get_json()
    idSet   = data["idSet"]
    reps    = data["reps"]
    res = queries.update_set_reps(idSet, reps)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/updateSetRPE", methods=["POST"])
def updateSetRPE():
    data    = request.get_json()
    idSet   = data["idSet"]
    rpe     = data["rpe"]
    res = queries.update_set_RPE(idSet, rpe)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/updateSetUnit", methods=["POST"])
def updateSetUnit():
    data    = request.get_json()
    idSet   = data["idSet"]
    unit    = data["unit"]
    res = queries.update_set_Unit(idSet, unit)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/updateSetSetNumber", methods=["POST"])
def updateSetSetNumber():
    data    = request.get_json()
    idSet   = data["idSet"]
    setNum  = data["setNum"]
    res = queries.update_set_setNum(idSet, setNum)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/updateWorkoutTitle", methods=["POST"])
def updateWorkoutTitle():
    data        = request.get_json()
    idWorkout   = data["idWorkout"]
    title       = data["title"]
    res = queries.update_workout_title(idWorkout, title)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/removeSet", methods=["POST"])
def removeSet():
    data        = request.get_json()
    idSet       = data["idSet"]
    idWorkout   = data["idWorkout"]
    idExercise  = data["idExercise"]
    res = queries.deleteSet(idSet, idWorkout, idExercise)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/addSet", methods=["POST"])
def addSet():
    data        = request.get_json()
    setNumber   = data["setNum"]
    idWorkout   = data["idWorkout"]
    idExercise  = data["idExercise"]
    res = queries.addSet(setNumber, idWorkout, idExercise)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getAllExercises", methods=["GET"])
def getAllExercises():
    res = queries.getExercises()
    return jsonify(res)
#------------------------------------------------------------
@app.route("/addExerciseToWorkout", methods=["POST"])
def addExerciseToWorkout():
    data = request.get_json()
    res  = queries.addExerciseToWorkout(data)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/createNewWorkout", methods=["POST"])
def createNewWorkout():
    data = request.get_json()
    date = data["date"]
    idUser = data["idUser"]
    res = queries.createNewWorkout(date, idUser)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getPRDataForLift", methods=["GET"])
def getPRDataForLift():
    idUser = request.args.get("idUser")
    idExercise = request.args.get("idExercise")
    res = queries.getPRDataForLift(idUser, idExercise)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/addExerciseToTrackedLifts", methods=["POST"])
def addExerciseToTrackedLifts():
    data = request.get_json()
    idUser = data["idUser"]
    idExercise = data["idExercise"]
    res = queries.addExerciseToTrackedLifts(idUser, idExercise)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/removeExerciseFromTrackedLifts", methods=["POST"])
def removeExerciseFromTrackedLifts():
    data = request.get_json()
    idUser = data["idUser"]
    idExercise = data["idExercise"]
    res = queries.removeExerciseFromTrackedLifts(idUser, idExercise)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getTrackedLifts", methods=["GET"])
def getTrackedLifts():
    idUser = request.args.get("idUser")
    res = queries.getTrackedLifts(idUser)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getLifters", methods=["GET"])
def getLifters():
    return jsonify(queries.getLifters())
#------------------------------------------------------------
@app.route("/setMode", methods=["POST"])
def setMode():
    data = request.get_json()
    mode = data["mode"]
    idUser = data["idUser"]
    res = queries.setMode(mode, idUser)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getMode", methods=["GET"])
def getMode():
    idUser = request.args.get("idUser")
    res = queries.getMode(idUser)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    userName = data["userName"]
    pwd = data["pwd"]
    res = queries.login(userName=userName, pwd=pwd)
    idUser = res["idUser"]
    socketio.emit("presence_changed")
    # eventually will need to be specific and emit this to 
    # only people on this user's friends list

    # actually have the data we need already, we just get
    # all the ids of this current user's friends
    # loop through them and emit to those rooms that were joined
    # by users when they logged in e.g :
    # friends = queries.get_friends(idUser)

    # for friend_id in friends:
    #     socketio.emit(
    #         "presence_changed",
    #         room=f"user:{friend_id}"
    #     )

    # make sure a folder exists for this user
    user_dir = f"uploads/users/{idUser}"
    os.makedirs(user_dir, exist_ok=True)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getProfilePic", methods=["GET"])
@cross_origin() 
def getProfilePic():
    idUser = request.args.get("idUser")

    if not idUser:
        return "", 400

    path = os.path.join("uploads", "users", idUser, "profilePic.jpg")

    if not os.path.exists(path):
        return "", 204  # clean "no image"

    return send_file(
        path,
        mimetype="image/jpeg",
        conditional=True
    )
#------------------------------------------------------------
@app.route("/logout", methods=["POST"])
def logout():
    data = request.get_json()
    idUser = data["idUser"]
    res = queries.logout(idUser)
    socketio.emit("presence_changed")
    # same as above
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getConversationId", methods=["GET"])
def getConversationId():
    idUser1 = request.args.get("idUser1")
    idUser2 = request.args.get("idUser2")
    return jsonify(queries.getConversationId(idUser1, idUser2))
#------------------------------------------------------------
@app.route("/createConversation", methods=["POST"])
def createConversation():
    data = request.get_json()
    idSender = data["idSender"]
    idRecipient = data["idRecipient"]
    res = queries.createConversation(idSender, idRecipient)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getConversationMessages", methods=["GET"])
def getConversationMessages():
    idConversation = request.args.get("idConversation")
    res = queries.getConversationMessages(idConversation)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/sendMsg", methods=["POST"])
def sendMsg():
    data = request.get_json()
    idConversation = data["idConversation"]
    idSender = data["idSender"]
    msg = data["msg"]
    res = queries.sendMsg(idConversation, idSender, msg)
    socketio.emit("msg_sent", res)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/updateLastReadAt", methods=["POST"])
def updateLastReadAt():
    data = request.get_json()
    idConversation = data.get("idConversation") # null sometimes
    idReader = data["idUser"]
    res = queries.updateLastReadAt(idConversation, idReader)
    socketio.emit("msg_read")
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getLastMsgInConversation", methods=["GET"])
def getLastMsgInConversation():
    idConversation = request.args.get("idConversation")
    idUser = request.args.get("idUser")
    res = queries.getLastMsgInConversation(idConversation, idUser)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getUsersInConversation", methods=["GET"])
def getUsersInConversation():
    idConversation = request.args.get("idConversation")
    res = queries.getUsersInConversation(idConversation)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/createGroupConversationFromDM", methods=["POST"])
def createGroupConversationFromDM():
    data = request.get_json()
    idCreator = data["idCreator"]
    idUserB = data["idUserB"]
    idUserNew = data["idUserNew"]
    participants = [idCreator, idUserB, idUserNew]
    res = queries.createGroupConversation(participants, idCreator)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getConvoTitle", methods=["GET"])
def getConvoTitle():
    idConversation = request.args.get("idConversation")
    res = queries.getConvoTitle(idConversation)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/addUserToExistingGroup", methods=["POST"])
def addUserToExistingGroup():
    data = request.get_json()
    idConversation = data["idConversation"]
    idUser = data["idUser"]
    res = queries.addUserToExistingGroup(idConversation, idUser)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/getGroupChatIds", methods=["GET"])
def getGroupChatIds():
    idUser = request.args.get("idUser")
    res = queries.getGroupChatIds(idUser)
    return jsonify(res)
#------------------------------------------------------------
@app.route("/changeGroupChatTitle", methods=["POST"])
def changeGroupChatTitle():
    data = request.get_json()
    idConversation = data["idConversation"]
    title = data["title"]
    res = queries.changeGroupChatTitle(idConversation, title)
    return jsonify(res)
#------------------------------------------------------------
if __name__ == "__main__":
    print("ASYNC MODE:", socketio.async_mode) # check to see if threading
    socketio.run(app, host="0.0.0.0", port=5002, debug=True, use_reloader=True)