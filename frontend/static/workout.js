import { curlastDay, curMonth, curYear, fillCalendar } from "./calendar.js";
import { config } from "./config.js";
import { setTemplateHTML, setUpdateFormTemplateHTML, ExerciseDashTemplate } from "./htmlTemplates.js";
import { currLifter, f } from "./lifterActions.js";
import { unit } from "./config.js";
const workoutContainer = document.querySelector(".workout"); // clear container



//-----------------------------------------------------------------------------
// This method takes a workout from database and formats it into the workout UI
// ExerciseRow class holds the exercise div and an exercise set div
//-----------------------------------------------------------------------------
export function getWorkoutFromWokroutID(workoutID){
    workoutContainer.dataset.workoutID = workoutID;            // for ez access
    f.post(config.WORKOUT_ENDPOINT, workoutID)
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
// data looks like {exercise info{}, sets[setinfo{}]
function loadSets(newExerciseRow, data){
    data.sets.forEach(set=>{
        makeNewSetBox(set, data, set.set, newExerciseRow);
    });
}
//-----------------------------------------------------------------------------
// method to create the HTML for a new Set being added to an Exercise Row
//-----------------------------------------------------------------------------
function makeNewSetBox(setInfo, liftInfo, setNumber, curExerciseRow){

    if (!setInfo.setID){   // if new setbox is being created from the front end
        setInfo = liftInfo;                // there will not be any setInfo yet
    }               // but there will be some setInfo like exercise information

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
        const setUpdateForm = e.target; // get all the info from the user input
        const setBox = setUpdateForm.closest(".set");
        const workoutID = setBox.dataset.workoutID;
        const idSet     = setUpdateForm.dataset.setID;
        let setWeight   = setUpdateForm.querySelector(`#weight${idSet}`).value;
        let setReps     = setUpdateForm.querySelector(`#reps${idSet}`).value;
        let setRPE      = setUpdateForm.querySelector(`#rpe${idSet}`).value;
        updateSet(idSet, setWeight, setReps, setRPE, workoutID);    // query DB
    }
}
//-----------------------------------------------------------------------------
function updateSet(idSet, setWeight, setReps, setRPE, workoutID){
    f.put(config.WORKOUT_ENDPOINT, {idSet, setWeight, setReps, setRPE})
        .then(data=>{
            const rawData = (document.querySelector(".trainingDate")).dataset.dateInfo;
            const dateInfo = JSON.parse(decodeURIComponent(rawData)); 
            createWorkoutGrid(dateInfo);     // these three functions to redraw 
            getWorkoutFromWokroutID(workoutID);             // the workout area
            fillCalendar(curYear, curMonth, curlastDay);    // and the calendar
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
        const idSet         = e.target.dataset.setID;
        const idWorkout     = e.target.dataset.workoutID;
        const idExercise    = e.target.dataset.exerciseID;
        const rawData       = (document.querySelector(".trainingDate"))
                                .dataset.dateInfo;
        const dateInfo       = JSON.parse(decodeURIComponent(rawData)); 
        e.target.closest(".set").remove();    // remove the setBox from the DOM
        f.delete(config.WORKOUT_ENDPOINT,{idSet,idWorkout,idExercise})
            .then(response=>{                            // reorder set numbers
                f.put(config.REORDER__SET_ENDPOINT, {idWorkout,idExercise})
                    .catch(err=>console.error(err));
            })
            .catch(err=>console.error(err))
            .finally(()=>{
                createWorkoutGrid(dateInfo); // redraw the workout area 
                getWorkoutFromWokroutID(idWorkout); 
                fillCalendar(curYear, curMonth, curlastDay); 
            });
    }
}


//-----------------------------------------------------------------------------
// listens to see if an item in workout area clicked on. 
//-----------------------------------------------------------------------------
export function setListener(){
    document.querySelector(".lifterBox").addEventListener("click", clickSetEvent);
    document.querySelector(".lifterBox").addEventListener("mouseover", clickSetEvent);
}
function clickSetEvent(event){  
    // fills out description area of an exerice    
    if (event.type === "mouseover" && event.target.classList.contains("exerciseMenuItem")){
        const DescriptionBox = document.querySelector(".exerciseDescription");
        const exercise = event.target;
        const liftInfo = JSON.parse(decodeURIComponent(exercise.dataset.liftInfo));
        const Description = liftInfo.Description;
        DescriptionBox.innerHTML = Description;
        return;
    }
    // selects an exercise to add to a workout   
    if (event.type === "click" && event.target.classList.contains("exerciseMenuItem")){
        const selectedExercise = event.target;
        checkIfWorkoutExistsOnDate(selectedExercise);
        return;
    }
    // expand set box and show update form
    if (event.type === "click" && event.target.classList.contains("set") ){
        const set = event.target;
        set.classList.toggle("setExpand");
        const setID = set.dataset.setID; 
        const form = document.querySelector(`#setUpdateForm${setID}`);
        form.classList.toggle("setUpdateFormVisible");
        return;
    } 
    // cursor click to bring up exercise dashboard
    if (event.type === "click" && event.target.classList.contains("cursor")){
        document.querySelector(".lifterBox").insertAdjacentHTML("beforeend",ExerciseDashTemplate());
        chooseNewExerciseBoxEvent();
        return;
    }
    //  closes the exercise dashboard via the x button
    if (event.type === "click" && event.target.id === "addExerciseX"){
        const exerciseDash  = document.querySelector(".addExerciseDash");
        exerciseDash.classList.toggle("addExerciseDashVisible"); 
        return;
    }
}
//-----------------------------------------------------------------------------
// before inserting exercise on a date, check if workout exists on that date
//-----------------------------------------------------------------------------
function checkIfWorkoutExistsOnDate(selectedExercise){
    let workoutID = null;
    const idUser = currLifter.id;
    const rawData = (document.querySelector(".trainingDate")).dataset.dateInfo;
    const Date = JSON.parse(decodeURIComponent(rawData)); 
    f.put(config.CHECK_IF_WORKOUT_EXISTS, Date, idUser)
        .then(res=>{
            if (res.success){
                workoutID = res.idWorkout;
                inserNewExerciseIntoWorkout(selectedExercise, workoutID);
            } else {
                f.post(config.CREATE_WORKOUT_ENDPOINT,Date)
                    .then(newWorkoutId=>{
                        inserNewExerciseIntoWorkout(selectedExercise,newWorkoutId);
                    })
                    .catch(err=>console.error(err));
                }
        })
        .catch(err=>console.error(err));
}
//-----------------------------------------------------------------------------
// method for isnerting a new exercise into an existing or into a new workout
//-----------------------------------------------------------------------------
function inserNewExerciseIntoWorkout(selectedExercise, idWorkout){
    const liftInfo = JSON.parse(decodeURIComponent(selectedExercise.dataset.liftInfo));
    const idExercise = liftInfo.exerciseID;
    const rawData = (document.querySelector(".trainingDate")).dataset.dateInfo;
    const dateInfo = JSON.parse(decodeURIComponent(rawData)); 
    const SetNumber = 1;
    f.post(config.INSERT_NEW_EXERCISE_ENDPOINT,{idWorkout, idExercise, SetNumber})
        .then(res=>{
            createWorkoutGrid(dateInfo);     // these three functions to redraw 
            getWorkoutFromWokroutID(idWorkout);             // the workout area
            fillCalendar(curYear, curMonth, curlastDay);    // and the calendar
        })
        .catch(err=>console.error(err));  
}
//-----------------------------------------------------------------------------
// event for clicking on add exercise. exercise dashboad visible/ fills out
//-----------------------------------------------------------------------------
function chooseNewExerciseBoxEvent(){
    const addExerciseDash = document.querySelector(".addExerciseDash");
    addExerciseDash.classList.toggle("addExerciseDashVisible");
    addExerciseDash.scrollIntoView({ behavior: 'smooth' })
    f.get(config.GET_EXERCISES_ENDPOINT)     // get all the exercises in the db
        .then(exercises=>{
            fillOutLiftCategoryMenus(exercises);
        })
        .catch(err=>console.error(err));
}
//-----------------------------------------------------------------------------
// Fill out bench / squat / deadlift / accessory columns in the exercise window
//-----------------------------------------------------------------------------
function fillOutLiftCategoryMenus(exercises){
    const addExerciseDash = document.querySelector(".addExerciseDash");
    exercises.forEach(eData=>{ 
        const liftCategory = eData.category;
        switch (liftCategory) {
            case "bench":
                fillOutLiftCategory(eData);
                break;
            case "squat":
                fillOutLiftCategory(eData);
                break;
            case "deadlift":
                fillOutLiftCategory(eData);
                break
            case "accessory":
                fillOutLiftCategory(eData);
                break
          }
    });
    addExerciseDash.scrollIntoView({ behavior: 'smooth' });
}
//-----------------------------------------------------------------------------
// helper function to fill out bench / squat / deadlift / accessory columns 
//-----------------------------------------------------------------------------
function fillOutLiftCategory(categoryData){
    const ExerciseMenu  = document.querySelector(`.${categoryData.category}ExerciseMenu`);
    ExerciseMenu.innerHTML = '';
    const liftsInCategory = categoryData.lifts_in_category;
    liftsInCategory.forEach(lift=>{
        ExerciseMenu.insertAdjacentHTML("beforeend", 
            `<li class="exerciseMenuItem" data-lift-info='${encodeURIComponent(JSON.stringify(lift))}'>
                ${lift.exerciseName}
            </li>`);
    });
}
//-----------------------------------------------------------------------------
// create workout input grid
//-----------------------------------------------------------------------------
export function createWorkoutGrid(dateInfo){
    workoutContainer.style.display = "flex";
    delete workoutContainer.dataset.workoutID;
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
// creates the button that removes a set from an exercise Row
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
