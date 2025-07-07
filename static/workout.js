import { curlastDay, curMonth, curYear, fillCalendar } from "./calendar.js";
import { config, date } from "./config.js";
import { f } from "./lifterActions.js";
const workoutContainer = document.querySelector(".workout"); // clear container
const liftsInWorkout = [];    // prevent same lift showing in multiple rows
let unit = "LBS";



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
        console.log("cursor clicked");
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
// this method will add a new set to an exercise row
//-----------------------------------------------------------------------------
function addSet(curExerciseRow, liftInfo){
    const i = document.querySelectorAll(`.${liftInfo.exercise}`).length;
    const newSet = document.createElement('div');
    newSet.classList.add(`${liftInfo.exercise}`);
    newSet.classList.add("set");
    newSet.setAttribute("id",`setID${liftInfo.set}`);
    newSet.insertAdjacentHTML("beforeend",`<div class="setNumber">${i+1}</div>`);
    // need to add logic to put in the fields to enter set details
    // then query the DB to update the current workout
    curExerciseRow.appendChild(newSet);
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
// load a set into exercise row from the workout loaded form DB 
//-----------------------------------------------------------------------------
function loadSet(newExerciseRow, liftInfo){
    const i = document.querySelectorAll(`.${liftInfo.exercise}`).length;
    const newSet = document.createElement('div');
    newSet.classList.add(`${liftInfo.exercise}`);
    newSet.classList.add("set");
    // set number
    newSet.setAttribute("id",`setID${liftInfo.setID}`);
    newSet.dataset.setID = `${liftInfo.setID}`;
    // ADD set info (weight reps rpe)
    newSet.insertAdjacentHTML("beforeend",CreateWorkoutTemplate(i, liftInfo));
    // WAY TO UPDATE a set
    newSet.appendChild(createSetUpdateForm(liftInfo));
    // WAY TO REMOVE a set
    newSet.appendChild(CreateRemoveSetButton(liftInfo));
    newSet.appendChild(addSetNumberToSetBox(i, liftInfo));
    newExerciseRow.appendChild(newSet);
}
//-----------------------------------------------------------------------------
// remove a set from an exercise Row
//-----------------------------------------------------------------------------
function CreateRemoveSetButton(liftInfo){
    // set remove HTML
    const setRemoveButton = document.createElement('div');
    setRemoveButton.classList.add("setRemove");
    setRemoveButton.setAttribute("id", `setRemove${liftInfo.setID}`);
    setRemoveButton.dataset.setID = liftInfo.setID
    setRemoveButton.dataset.workoutID = liftInfo.workoutID; 
    setRemoveButton.innerHTML = `x`;
    // could add the event listener here
    return setRemoveButton;
}

//-----------------------------------------------------------------------------
// HTML to create the layout for a set in the workout window
//-----------------------------------------------------------------------------
function CreateWorkoutTemplate(i, liftInfo){
    return `
    <div class="setInfoWrapper data-set-i-d="${liftInfo.setID}">
        <div class="setWeightRepsWrapper">
            <div class="setInfo setWeight">${liftInfo.weight}</div> 
            <div class="setInfo setBy">&nbsp;x&nbsp;</div> 
            <div class="setInfo setReps">${liftInfo.reps}</div>
        </div>
        <div class="setRPEwrapper">rpe&nbsp; 
            <div class="setInfo setRPE">${liftInfo.rpe}</div>
        </div>
    </div>`;
}
//-----------------------------------------------------------------------------
// create set number display for the SetBox
//-----------------------------------------------------------------------------
function addSetNumberToSetBox(i, liftInfo){
    const setNumber = document.createElement('div');
    setNumber.classList.add("setNumber");
    setNumber.setAttribute("id", `setID${liftInfo.setID}`);
    setNumber.innerHTML = `${i+1}`;
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
// This method takes a workout from database and formats it into the workout UI
// ExerciseRow class holds the exercise div and an exercise set div
//-----------------------------------------------------------------------------
export function getWorkoutFromWokroutID(workoutID){
    liftsInWorkout.length = 0;
    f.post("workout", workoutID)
        .then(lifts=>{    // go through each exercise in workout pulled from DB
            lifts.forEach((lift)=>{
                if (liftsInWorkout.includes(lift.exercise)){//already made row?
                    const curRow = 
                        document.querySelector(`#exercise-${lift.exercise}`);
                    loadSet(curRow,lift);              // add a set to that row
                    return;             // go head and move on to next exercise
                }
                makeExerciseRow(lift);          // if new exercise make new row
            });
            createCursor(workoutID);
        })
        .catch(error=>console.error(error));
}
//-----------------------------------------------------------------------------
// helper method to make the UI exercise Row
//-----------------------------------------------------------------------------
function makeExerciseRow(liftInfo){
    const newRow = createExerciseRow(liftInfo.exercise);        // new exercise
    createExerciseBox(newRow,liftInfo);               // make a new row with it
    liftsInWorkout.push(liftInfo.exercise);            // mark as no longer new
    loadSet(newRow, liftInfo);                  // at least 1 set done, add set
}
//-----------------------------------------------------------------------------
// HTML for the form that will be used to update a set
//-----------------------------------------------------------------------------
function createSetUpdateForm(liftInfo){
    const updateForm = document.createElement('div');
    updateForm.classList.add(`setUpdateForm`);
    updateForm.setAttribute("id",`setUpdateForm${liftInfo.setID}`);
    updateForm.innerHTML = `
        <form class="setUpdate" data-set-i-d="${liftInfo.setID}" data-set-workout-i-d="${liftInfo.workoutID}">
            <div class="inputWrapper">
                <input class="setInfoField setWeightUpdate" id="weight${liftInfo.setID}" type="text" value="${liftInfo.weight}">
                <div class="inputTag">${unit}</div>
            </div>
            <div class="inputWrapper">
                <input class="setInfoField setRepsUpdate" id="reps${liftInfo.setID}" type="text" value="${liftInfo.reps}">
                <div class="inputTag">reps</div>
            </div>
            <div class="inputWrapper">
                <input class="setInfoField setRPEUpdate" id="rpe${liftInfo.setID}" type="text" value="${liftInfo.rpe}">
                <div class="inputTag">RPE</div></div>
            <div class="inputWrapper"><input class="setInfoField setButton" type="submit" value="⠀⃝ update">
            </div>
        </form>`;
    return updateForm;
}
//-----------------------------------------------------------------------------
// listens to see if a set gets updated
//-----------------------------------------------------------------------------
export function formUpdateListner(){
    const workoutArea = document.querySelector(".workout");
    workoutArea.addEventListener("submit", updateSetEvent);
    workoutArea.addEventListener("click", removeSetEvent);
}
//-----------------------------------------------------------------------------
// if set updated, query the DB
//-----------------------------------------------------------------------------
function updateSetEvent(e){
    if (e.target.classList.contains("setUpdate")){
        e.preventDefault();
        const set       = e.target;
        const workoutID = set.dataset.setWorkoutID;
        const idSet     = set.dataset.setID;
        let setWeight = set.querySelector(`#weight${idSet}`).value;
        let setReps   = set.querySelector(`#reps${idSet}`).value;
        let setRPE    = set.querySelector(`#rpe${idSet}`).value;
        f.put(config.WORKOUT_ENDPOINT, {idSet, setWeight, setReps, setRPE})
            .then(response=>{
                if (response === 1){ // update ocurred
                    const rawData = (document.querySelector(".trainingDate")).dataset.dateInfo;
                    const dateInfo = JSON.parse(decodeURIComponent(rawData));
                    createWorkoutGrid(dateInfo);
                    getWorkoutFromWokroutID(workoutID); 
                }
            })
            .catch(err=>console.error(err));
    }
}
//-----------------------------------------------------------------------------
// if set remove button clicked, remove set from DB
//-----------------------------------------------------------------------------
function removeSetEvent(e){
    if (e.target.classList.contains("setRemove")){
        const setToRemove = e.target.dataset.setID;
        const workoutID = e.target.dataset.workoutID;
        const rawData = (document.querySelector(".trainingDate")).dataset.dateInfo;
        const dateInfo = JSON.parse(decodeURIComponent(rawData));
        f.delete(config.WORKOUT_ENDPOINT,setToRemove)
            .then(response=>{
                console.log(response);
                createWorkoutGrid(dateInfo);
                getWorkoutFromWokroutID(workoutID); 
                fillCalendar(curYear, curMonth, curlastDay); // redraw calendar 
            })
            .catch(err=>console.error(err));
    }
}
