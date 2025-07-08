import { curlastDay, curMonth, curYear, fillCalendar } from "./calendar.js";
import { config } from "./config.js";
import { setTemplateHTML, setUpdateFormTemplateHTML } from "./htmlTemplates.js";
import { f } from "./lifterActions.js";

const workoutContainer = document.querySelector(".workout"); // clear container
let unit = "LBS";


//-----------------------------------------------------------------------------
// This method takes a workout from database and formats it into the workout UI
// ExerciseRow class holds the exercise div and an exercise set div
//-----------------------------------------------------------------------------
export function getWorkoutFromWokroutID(workoutID){
    f.post("workout", workoutID)
        .then(lifts=>{  
            lifts.forEach(lift=>{            // will iterate over each exercise
                fillExerciseRow(lift);       // this will iterate over each set
            });
            createCursor(lifts.workoutID);            // place cursor at bottom
        })
        .catch(error=>console.error(error));
}
//-----------------------------------------------------------------------------
// helper method to make the UI exercise Row
//-----------------------------------------------------------------------------
function fillExerciseRow(liftInfo){
    const newRow = createExerciseRow(liftInfo.exercise);        // new exercise
    createExerciseBox(newRow,liftInfo);               // make a new row with it
    loadSets(newRow, liftInfo);                 // at least 1 set done, add set
}
//-----------------------------------------------------------------------------
// load a set into exercise row from the workout loaded form DB 
//-----------------------------------------------------------------------------
function loadSets(newExerciseRow, data){
    // data still contains the exercise info at the top level
    data.sets.forEach(set=>{
        makeNewSetBox(set, data, set.set, newExerciseRow);
    });
}
//-----------------------------------------------------------------------------
// method to create the HTML for a new Set being added to an Exercise Row
//-----------------------------------------------------------------------------
function makeNewSetBox(setInfo, liftInfo, setNumber, curExerciseRow){

    if (!setInfo.setID){
        setInfo = liftInfo;
    }

    const newSet = document.createElement('div');
    newSet.classList.add("set");
    newSet.classList.add(`${liftInfo.exercise}`);
    newSet.setAttribute("id",`setID${setInfo.setID}`);

    newSet.dataset.liftInfo = JSON.stringify(liftInfo);
    newSet.dataset.setID = `${setInfo.setID}`;
    newSet.dataset.workoutID = liftInfo.workoutID;
   
    newSet.insertAdjacentHTML("beforeend",CreateSetTemplate(setInfo));
    newSet.appendChild(createSetUpdateForm(setInfo));
    newSet.appendChild(CreateRemoveSetButton(liftInfo, setInfo));
    newSet.appendChild(addSetNumberToSetBox(setNumber, setInfo));

    curExerciseRow.appendChild(newSet);
}
//-----------------------------------------------------------------------------
// element to help add and remove exercises from a workout
//-----------------------------------------------------------------------------
export function createCursor(){
    const cursor = document.createElement('div'); // cursor for adding exercise
    cursor.classList.add("cursor");
    cursor.innerHTML = '╋';
    workoutContainer.appendChild(cursor);
    cursor.scrollIntoView({ behavior: 'smooth' });
}



//-----------------------------------------------------------------------------
// listens to see if a set gets updated
//-----------------------------------------------------------------------------
export function formUpdateListner(){
    workoutContainer.addEventListener("submit", updateSetEvent);
    workoutContainer.addEventListener("click", removeSetEvent);
}
//-----------------------------------------------------------------------------
// if set updated, query the DB
//-----------------------------------------------------------------------------
function updateSetEvent(e){
    if (e.target.classList.contains("setUpdate")){
        e.preventDefault();
        const setUpdateForm = e.target;
        const setBox = setUpdateForm.closest(".set");
        const workoutID = setBox.dataset.workoutID;
        const idSet     = setUpdateForm.dataset.setID;
        let setWeight   = setUpdateForm.querySelector(`#weight${idSet}`).value;
        let setReps     = setUpdateForm.querySelector(`#reps${idSet}`).value;
        let setRPE      = setUpdateForm.querySelector(`#rpe${idSet}`).value;
        updateSet(idSet, setWeight, setReps, setRPE, workoutID);
    }
}
//-----------------------------------------------------------------------------
function updateSet(idSet, setWeight, setReps, setRPE, workoutID){
    f.put(config.WORKOUT_ENDPOINT, {idSet, setWeight, setReps, setRPE})
        .then(data=>{
            const rawData = (document.querySelector(".trainingDate")).dataset.dateInfo;
            const dateInfo = JSON.parse(decodeURIComponent(rawData)); 
            createWorkoutGrid(dateInfo);
            getWorkoutFromWokroutID(workoutID); 
            fillCalendar(curYear, curMonth, curlastDay); 
        })
        .catch(err=>console.error(err));
}



//-----------------------------------------------------------------------------
// this method will add a new set to an exercise row
//-----------------------------------------------------------------------------
function addSet(curExerciseRow, liftInfo){
    // first query the db and create a new set
    const i = document.querySelectorAll(`.${liftInfo.exercise}`).length;
    createNewDBset(liftInfo, i+1, curExerciseRow);
}
//-----------------------------------------------------------------------------
function createNewDBset(curliftInfo, setNumber, curExerciseRow){
    const SetNumber = setNumber;
    const idExercise = curliftInfo.exerciseID;
    const idWorkout = curliftInfo.workoutID;
    f.post(config.SET_ENDPOINT, {SetNumber, idExercise, idWorkout})
        .then(newSetInfo=>{
            const liftInfo = updateLiftInfo(curliftInfo, newSetInfo);
            makeNewSetBox({}, liftInfo, setNumber-1, curExerciseRow)
        })
        .catch(err=>console.error(err));
}
//-----------------------------------------------------------------------------
// fills out liftinfo with the users input (validated by DB)
//-----------------------------------------------------------------------------
function updateLiftInfo(curliftInfo, newSetInfo){
    return  {
        comment     : newSetInfo.setComment,
        exercise    : curliftInfo.exercise,
        exerciseID  : newSetInfo.idExercise,
        setNumber   : newSetInfo.set,
        paused      : newSetInfo.paused,
        reps        : newSetInfo.setReps,
        rpe         : newSetInfo.setRPE,
        setID       : newSetInfo.idSet,
        videoLink   : newSetInfo.setVideo,
        weight      : newSetInfo.setWeight,
        workoutID   : newSetInfo.idWorkout
    }
}



//-----------------------------------------------------------------------------
// if set remove button clicked, remove set from DB
//-----------------------------------------------------------------------------
function removeSetEvent(e){
    if (e.target.classList.contains("setRemove")){
        const setToRemove = e.target.dataset.setID;
        const workoutID = e.target.dataset.workoutID;
        const exerciseID = e.target.dataset.exerciseID;
        const rawData = (document.querySelector(".trainingDate")).dataset.dateInfo;
        const dateInfo = JSON.parse(decodeURIComponent(rawData)); 
        e.target.closest(".set").remove();    // remove the setBox from the DOM
        f.delete(config.WORKOUT_ENDPOINT,setToRemove)
            .then(response=>{
                // reorder set numbers
                f.put(config.REORDER__SET_ENDPOINT, {workoutID,exerciseID})
            })
            .catch(err=>console.error(err))
            .finally(()=>{
                // redraw the workout area 
                createWorkoutGrid(dateInfo);
                getWorkoutFromWokroutID(workoutID); 
                fillCalendar(curYear, curMonth, curlastDay); 
            });
    }
}



//-----------------------------------------------------------------------------
// listens to see if a set was clicked on. if so, the set CSS will expand 
//-----------------------------------------------------------------------------
export function setListener(){
    workoutContainer.addEventListener("click", clickSetEvent);
}
function clickSetEvent(event){
    if (event.target.classList.contains("set") ){
        const set = event.target;
        set.classList.toggle("setExpand");
        const setID = set.dataset.setID; // expand set box and show update form
        const form = document.querySelector(`#setUpdateForm${setID}`);
        form.classList.toggle("setUpdateFormVisible");
    } 
    if (event.target.classList.contains("cursor")){
        const e = createExerciseRow("new lift");
        // logic here to create the options for lifts to perform
        createExerciseBox(e,{});
        // then the only other thing the cursor has to do is create 
        // a new workout in the DB if one does not already exist for this date
        let cursor = document.querySelector(".cursor");
        workoutContainer.removeChild(cursor);
        workoutContainer.appendChild(cursor);
        cursor.scrollIntoView({ behavior: 'smooth' });
    }
}





//-----------------------------------------------------------------------------
// create workout input grid
//-----------------------------------------------------------------------------
export function createWorkoutGrid(dateInfo){
    workoutContainer.style.display = "flex";
    workoutContainer.innerHTML = ``;   
    fillWorkoutDate(dateInfo);  
}
//-----------------------------------------------------------------------------
// create the header for the selected workout display area
//-----------------------------------------------------------------------------
export function createrWorkoutHeader(dateInfo){
    createWorkoutGrid(dateInfo);
}
//-----------------------------------------------------------------------------
// helpers for creating the workout input grid
// this  is the container for exercises and sets
//-----------------------------------------------------------------------------
function createExerciseRow(exercise){ 
    const newExerciseRow = document.createElement('div');
    newExerciseRow.setAttribute("id",`exercise-${exercise}`);
    newExerciseRow.classList.add("exerciseRow");
    workoutContainer.appendChild(newExerciseRow);    
    return newExerciseRow;
    }





//-----------------------------------------------------------------------------
// remove a set from an exercise Row
//-----------------------------------------------------------------------------
function CreateRemoveSetButton(liftInfo, setInfo){
    const setRemoveButton = document.createElement('div');
    setRemoveButton.classList.add("setRemove");
    setRemoveButton.setAttribute("id", `setRemove${setInfo?.setID ?? liftInfo.setID}`);
    setRemoveButton.dataset.setID = setInfo?.setID ?? liftInfo.setID
    setRemoveButton.dataset.workoutID = liftInfo.workoutID; 
    setRemoveButton.dataset.exercise = liftInfo.exercise;
    setRemoveButton.dataset.exerciseID = liftInfo.exerciseID;
    setRemoveButton.innerHTML = `x`;
    return setRemoveButton;
}

//-----------------------------------------------------------------------------
// HTML to create the layout for a set in the workout window
//-----------------------------------------------------------------------------
function CreateSetTemplate(liftInfo){
    if (!liftInfo) liftInfo = 0;
    return setTemplateHTML(liftInfo);
}
//-----------------------------------------------------------------------------
// create set number display for the SetBox
//-----------------------------------------------------------------------------
function addSetNumberToSetBox(i, liftInfo){
    const setNumber = document.createElement('div');
    setNumber.classList.add("setNumber");
    setNumber.setAttribute("id", `setID${liftInfo.setID}`);
    setNumber.innerHTML = `${liftInfo?.set ?? i+1}`;
    return setNumber;
}
//-----------------------------------------------------------------------------
// this will create the first box that shows what exercise is being done
//-----------------------------------------------------------------------------
function createExerciseBox(newExerciseRow, liftInfo){
    // first box of every set is the name of the exercise 
    const newExercise = document.createElement('div');
    newExercise.setAttribute("id",`${liftInfo.exercise}`);
    newExercise.classList.add("exercise");
    newExercise.innerHTML += `<p>${liftInfo.exercise}</p>`;
    newExercise.insertAdjacentHTML("beforeend", 
        `<div class = "addSet">╋</div>`);
    newExercise.dataset.liftInfo = JSON.stringify(liftInfo);
    newExercise.addEventListener("click", ()=>{addSet(newExerciseRow, liftInfo)});
    newExerciseRow.appendChild(newExercise);
}
//-----------------------------------------------------------------------------
// create the header (date for now) of the current workout
//-----------------------------------------------------------------------------
function fillWorkoutDate(dateInfo){
    const safeData = encodeURIComponent(JSON.stringify(dateInfo));
    const workoutHeader = document.createElement('div');
    workoutHeader.classList.add("workoutHeader");
    workoutHeader.innerHTML = `
    <div class="sessionTitle">Training Session:</div>
    <div class="trainingDate" data-date-info="${safeData}">
        ${dateInfo.dow.toUpperCase()}
        ${dateInfo.month} 
        ${dateInfo.day} 
        ${dateInfo.year}
    </div>`;
    workoutContainer.appendChild(workoutHeader);
}


//-----------------------------------------------------------------------------
// HTML for the form that will be used to update a set
//-----------------------------------------------------------------------------
function createSetUpdateForm(liftInfo){
    const updateForm = document.createElement('div');
    updateForm.classList.add(`setUpdateForm`);
    updateForm.setAttribute("id",`setUpdateForm${liftInfo.setID}`);
    updateForm.innerHTML = setUpdateFormTemplateHTML(liftInfo, unit);
    return updateForm;
}
