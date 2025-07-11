from flask import Flask, render_template, jsonify, request
import queries

app = Flask(__name__)
#------------------------------------------------------------------------------
@app.route("/")
def home():
    return render_template('index.html')
#------------------------------------------------------------------------------
@app.route("/lifters", methods=["GET", "POST", "DELETE"])
def users():
    if request.method == "GET":
        lifters = queries.getLifters()
        return jsonify(lifters), 200
    
    elif request.method == "POST":
        newLifter = request.get_json()
        res = queries.postNewLifter(newLifter)
        print(res)
        return jsonify(res)
        
    elif request.method == "DELETE":
        lifterToREmove = request.get_json()
        res = queries.removeLifter(lifterToREmove)
        return jsonify(res)
 #------------------------------------------------------------------------------   
@app.route("/lifter", methods=["POST"])
def getUser():
    lifterID = request.get_json()
    lifterInfo = queries.getLifterInfo(lifterID)
    return jsonify(lifterInfo)
#------------------------------------------------------------------------------
@app.route("/monthlyWorkouts", methods=["POST"])
def monthlyWorkouts():
    data = request.get_json()
    return jsonify(queries.getDaysTrained(data['userId'], data['curDate'])), 200
#------------------------------------------------------------------------------
@app.route("/workout", methods=["POST", "PUT", "DELETE"])
def getUpdateWorkout():
    if request.method == "POST": # get a workout
        workoutId = request.get_json()
        return jsonify(queries.getWorkoutFromID(workoutId))
    if request.method == "PUT": # update a workout
        updateInfo = request.get_json()
        result = queries.updateSet(updateInfo) # 1 means an update happened #0 none
        return jsonify(result)
    if request.method == "DELETE":
        data = request.get_json()
        idSet = data["idSet"]
        idWorkout = data["idWorkout"]
        idExercise = data["idExercise"]
        result = queries.deleteSet(idSet, idWorkout, idExercise)
        return jsonify(result)
#------------------------------------------------------------------------------
@app.route("/createWorkout", methods=["POST"])
def createWorkout():
    data = request.get_json()
    lifterID = data['lifterID']
    # get appropriate date format for sql 
    date =  str(data['year'])+ '-' + str(data['monthNumber']+1) + '-' + str(data['day'])
    return jsonify(queries.createNewWorkout(date, lifterID))
#------------------------------------------------------------------------------
@app.route("/createSet", methods=["POST"])
def createSet():
    setData = request.get_json()
    return jsonify(queries.createSet(setData))
#------------------------------------------------------------------------------
@app.route("/ExerciseOrder", methods=["PUT", "DELETE"])
def deleteFromExerciseOrder():
    data = request.json()
    idWorkout  = data["idWorkout"]
    idExercise = data["idExercise"]
    queries.deleteExerciseOrder(idWorkout, idExercise)
#------------------------------------------------------------------------------
@app.route("/reorderSetNumbers", methods=["PUT"])
def reorderSetNumbers():
    data = request.get_json()
    idExercise = data["idExercise"]
    idWorkout = data["idWorkout"]
    return jsonify(queries.reorderSetNumbers(idWorkout, idExercise))
#------------------------------------------------------------------------------
@app.route("/getExercises", methods=["GET"])
def getExercises():
    return jsonify(queries.getExercises())
#------------------------------------------------------------------------------
@app.route("/insertNewExerciseIntoWorkout", methods=["POST"])
def insertNewExerciseIntoWorkout():
    data = request.get_json()
    print("data recieved for insertion: ", data)
    return jsonify(queries.insertNewExerciseIntoWorkout(data))
#------------------------------------------------------------------------------
@app.route("/workoutExistCheck", methods=["PUT"])
def workoutExistCheck():
    data = request.get_json()
    date =  date =  str(data['year'])+ '-' + str(data['monthNumber']+1) + '-' + str(data['day'])
    idUser = data["lifterID"]
    print(f'date received for workout exist check: " {date} {idUser}')
    return jsonify(queries.workoutExistCheck(idUser, date))
#------------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5001)