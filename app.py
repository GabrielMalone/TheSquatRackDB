from flask import Flask, render_template, jsonify, request
import database

app = Flask(__name__)
#------------------------------------------------------------------------------
@app.route("/")
def home():
    return render_template('index.html')
#------------------------------------------------------------------------------
@app.route("/lifters", methods=["GET", "POST", "DELETE"])
def users():
    if request.method == "GET":
        lifters = database.getLifters()
        return jsonify(lifters), 200
    
    elif request.method == "POST":
        newLifter = request.get_json()
        res = database.postNewLifter(newLifter)
        print(res)
        return jsonify(res)
        
    elif request.method == "DELETE":
        lifterToREmove = request.get_json()
        res = database.removeLifter(lifterToREmove)
        return jsonify(res)
 #------------------------------------------------------------------------------   
@app.route("/lifter", methods=["POST"])
def getUser():
    lifterID = request.get_json()
    lifterInfo = database.getLifterInfo(lifterID)
    return jsonify(lifterInfo)
#------------------------------------------------------------------------------
@app.route("/monthlyWorkouts", methods=["POST"])
def monthlyWorkouts():
    data = request.get_json()
    return jsonify(database.getDaysTrained(data['userId'], data['curDate'])), 200
#------------------------------------------------------------------------------
@app.route("/workout", methods=["POST", "PUT", "DELETE"])
def getUpdateWorkout():
    if request.method == "POST": # get a workout
        workoutId = request.get_json()
        return jsonify(database.getWorkoutFromID(workoutId))
    if request.method == "PUT": # update a workout
        updateInfo = request.get_json()
        result = database.updateSet(updateInfo) # 1 means an update happened #0 none
        return jsonify(result)
    if request.method == "DELETE":
        setID = request.get_json()
        result = database.deleteSet(setID)
        return jsonify(result)
#------------------------------------------------------------------------------
@app.route("/createWorkout", methods=["POST"])
def createWorkout():
    data = request.get_json()
    lifterID = data['lifterID']
    # get appropriate date format for sql 
    date =  str(data['year'])+ '-' + str(data['monthNumber']+1) + '-' + str(data['day'])
    return jsonify(database.reateNewWorkout(lifterID, date))
#------------------------------------------------------------------------------
@app.route("/createSet", methods=["POST"])
def createSet():
    setData = request.get_json()
    return jsonify(database.createSet(setData))
#------------------------------------------------------------------------------
@app.route("/createExerciseOrder", methods=["PUT"])
def createExerciseOrder():
    data = request.get_json()
    orderNumber = data["orderNumber"]
    exerciseID = data["exerciseID"]
    workoutID = data["workoutID"]
    return jsonify(database.createExerciseOrder(workoutID, exerciseID, orderNumber))
#------------------------------------------------------------------------------
@app.route("/reorderSetNumbers", methods=["PUT"])
def reorderSetNumbers():
    data = request.get_json()
    exerciseID = data["exerciseID"]
    workoutID = data["workoutID"]
    return jsonify(database.reorderSetNumbers(workoutID, exerciseID))
#------------------------------------------------------------------------------
@app.route("/getExercises", methods=["GET"])
def getExercises():
    return jsonify(database.getExercises())
#------------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5001)