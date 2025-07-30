from flask import Flask, render_template, jsonify, request, send_from_directory
import appQueries.queries as queries
import appQueries.chartQueries as chartQueries
import os

app = Flask(__name__,
            template_folder='../frontend/templates',
            static_folder='../frontend/static')

#------------------------------------------------------------------------------
@app.route("/")
def home():
    css_files = [
        'addExerciseDash.css',
        'notesSection.css',
        'monthlyCharts.css',
        'workoutDash.css',
        'newlifter.css',
        'cursor.css',
        'dashHeaders.css',
        'lifterBoxHeader.css',
        'sidebar.css',
        'header.css',
        'variables.css',
        'prDash.css',
        'style.css',
        'calendar.css',
        'set.css',
        'video.css',
        'sessionTitle.css',
        'login.css'
    ]
    return render_template('index.html', css_files=css_files)
#------------------------------------------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    loginData = request.get_json()
    return jsonify(queries.login(loginData))
#------------------------------------------------------------------------------

@app.route('/videos/<path:filename>')  # serve a video file from backend folder
def serveVideo(filename):
    return send_from_directory('videos', filename)
#------------------------------------------------------------------------------

def setVideoLink(link, setId):              # helper method for the route below
    return queries.setVideoLink(link, setId)
#------------------------------------------------------------------------------

@app.route("/uploadSetVideo", methods=["POST"])
def uploadSetVideo():
    video  = request.files['video']
    setId  = request.form['setId']
    userId = request.form['userId']
    if (video):  # create a unique folder for each video / userid / setid / vid
        folderPath = os.path.join("videos", userId, setId)
        os.makedirs(folderPath, exist_ok=True) # make any directories that dont exist
        filePath = os.path.join(folderPath, video.filename)
        video.save(filePath) #save vid/update set in DB to link to video in backend      
        return jsonify(setVideoLink(filePath, setId)),  200 
    else: 
        return {'status' : 'no file uploaded'}, 400
#------------------------------------------------------------------------------

@app.route("/lifters", methods=["GET", "POST", "DELETE"])
def users():
    if request.method == "GET":
        lifters = queries.getLifters()
        return jsonify(lifters), 200
    
    elif request.method == "POST":
        newLifterData = request.get_json()
        res = queries.postNewLifter(newLifterData)
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

@app.route("/lifterByUserName", methods=["POST"])
def getUserByUserName():
    userName = request.get_json();
    return jsonify(queries.getUserByUserName(userName))
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
        print(updateInfo)
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
    return jsonify(queries.insertNewExerciseIntoWorkout(data))
#------------------------------------------------------------------------------

@app.route("/workoutExistCheck", methods=["PUT"])
def workoutExistCheck():
    data = request.get_json()
    date =  date =  str(data['year'])+ '-' + str(data['monthNumber']+1) + '-' + str(data['day'])
    idUser = data["lifterID"]
    return jsonify(queries.workoutExistCheck(idUser, date))
#------------------------------------------------------------------------------

@app.route("/getMonthlyTrainingVolume", methods=["POST"])
def getMonthlyTrainingVolume():
    data = request.get_json()
    idUser = data["idUser"]
    ExerciseCategories = data["ExerciseCategories"]
    month = data["month"]
    year = data["year"]
    return jsonify(chartQueries.getMonthlyTrainingVolume(idUser, ExerciseCategories, month, year))
#------------------------------------------------------------------------------

@app.route("/getMonthlyTrainingInensity", methods=["POST"])
def getMonthlyTrainingInensity():
    data = request.get_json()
    idUser = data["idUser"]
    ExerciseCategories = data["ExerciseCategories"]
    month = data["month"]
    year = data["year"]
    return jsonify(chartQueries.getMonthlyTrainingIntensity(idUser, ExerciseCategories, month, year))
#------------------------------------------------------------------------------

@app.route("/getMonthlyTrainingFrequency", methods=["POST"])
def getMonthlyTrainingFrequency():
    data = request.get_json()
    idUser = data["idUser"]
    ExerciseCategories = data["ExerciseCategories"]
    month = data["month"]
    year = data["year"]
    return jsonify(chartQueries.getMonthlyTrainingFrequency(idUser, ExerciseCategories, month, year))
#------------------------------------------------------------------------------

@app.route("/getPRDataForLift", methods=["POST"])
def getPRDataForLift():
    data = request.get_json()
    idUser = data["idUser"]
    lift = data["lift"]
    return jsonify(chartQueries.getPRDataForLift(idUser, lift))
#------------------------------------------------------------------------------

@app.route("/getExerciseInfo", methods=["POST"])
def getExerciseInfo():
    idExercise = request.get_json()
    return jsonify(queries.getExerciseInfo(idExercise))
#------------------------------------------------------------------------------

@app.route("/saveSessionNote", methods=["POST"])
def saveSessionNote():
    data = request.get_json()
    idWorkout = data["idWorkout"]
    note = data["note"]
    print(idWorkout, note)
    return jsonify(queries.saveSessionNote(idWorkout, note))
#------------------------------------------------------------------------------

@app.route("/updateSessionName", methods=["POST"])
def updateSessionName():
    data = request.get_json()
    idWorkout = data["idWorkout"]
    newTitle = data["newTitle"]
    return jsonify(queries.updateSessionName(idWorkout, newTitle))
#------------------------------------------------------------------------------

@app.route("/searchForLifter", methods=["POST"])
def searchForLifter():
    input = request.get_json()
    return jsonify(queries.searchForLifter(input));
#------------------------------------------------------------------------------
@app.route("/doIfollow", methods=["POST"])
def doIfollowLifter():
    data = request.get_json()
    followerID = data["followerID"]
    followeeID = data["followeeID"]
    return jsonify(queries.doIfollowLifter(followerID, followeeID))
#------------------------------------------------------------------------------

@app.route("/followLifter", methods=["POST"])
def followLifter():
    data = request.get_json()
    followerID = data["follower"]
    followeeID = data["followee"]
    return jsonify(queries.followLifter(followerID, followeeID))
#------------------------------------------------------------------------------

@app.route("/unfollowLifter", methods=["DELETE"])
def unfollowLifter():
    data = request.get_json()
    followerID = data["follower"]
    followeeID = data["followee"]
    return jsonify(queries.unfollowLifter(followerID, followeeID))
#------------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5001)