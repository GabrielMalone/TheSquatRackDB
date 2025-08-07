import { curlastDay, curMonth, curYear, fillCalendar } from "./calendarDash.js";
import { accessLevelValid, endpoint as end, unit } from "../config.js";
import { setTemplateHTML, setUpdateFormTemplateHTML, sessionTitleFormHTML } from "../htmlTemplates.js";
import { fillOutExerciseSelectMenu, createExerciseDash } from "./exerciseSelectDash.js";
import { currLifter, f, getLifterObject, LIFTERS} from "../lifterSidebar.js";
import { createPrDash } from "./prDash.js";
import { createCursor } from "../cursor.js";
import { loggedinLifter } from "../login.js";

const workoutContainer = document.querySelector(".workout"); // clear container

//-----------------------------------------------------------------------------
// This method takes workout from database and formats it into workout DASH UI
// ExerciseRow class holds the exercise div and an exercise set div
//-----------------------------------------------------------------------------
export async function getWorkoutFromWokroutID(idWorkout){
    workoutContainer.dataset.idWorkout = idWorkout;            // for ez access
    const lifts = await f.post(end.WORKOUT_ENDPOINT, idWorkout)
    for (const lift of lifts){
        await fillExerciseRow(lift);  
    }
    nameSession(lifts);
    if ( await accessLevelValid()){
        createCursor(workoutContainer);              // place cursor at bottom
    }
    createNotesSection(lifts[0]?.note);
    scrollToWorkout();
}
//-----------------------------------------------------------------------------
// if any update/delete/add refresh the various dashes 
//-----------------------------------------------------------------------------
function updateDashesOnChange(dateInfo, idWorkout, curYear, curMonth, curlastDay){
    createWorkoutGrid(dateInfo);             // these four functions to redraw 
    getWorkoutFromWokroutID(idWorkout);                    // the workout area
    fillCalendar(curYear, curMonth, curlastDay);           // and the calendar  
    const lifter = getLifterObject(currLifter.id);  
    createPrDash(lifter.prDashSelection, lifter.id);            // and pr dash
}
//-----------------------------------------------------------------------------
// event actions for the workout dash
//-----------------------------------------------------------------------------
function workoutDashClickEvents(e){
    removeSetEvent(e);
    removeCommentEvent(e);
    addExerciseEvent(e);
    addCommentToSet(e);
    submitCommentForSet(e);
    expandSetEvent(e);
    closeWorkoutDash(e);
    qualifierClickEven(e);
    saveNoteEvent(e);
}
//-----------------------------------------------------------------------------
// if any notes present, they will appear here
//-----------------------------------------------------------------------------
async function createNotesSection(note){
    if (!note){ 
        note = "";
    }
    let button = "";
    if (await accessLevelValid()){
        button = `<div class="saveNoteButton">
            <div class="saveNoteButtonText">save note</div>
        </div>`
    }
    const notesSection = 
    `
    <div class="notesSectionWrapper">
        <div class="notesSectionHeader">Session Notes</div>
        <div class="notesSectionInput" contenteditable="true">${note}</div>
        ${button}
    </div>
    `
    workoutContainer.insertAdjacentHTML("beforeend",notesSection);
    const notesSectionInput = document.querySelector('.notesSectionInput');
    if (! await accessLevelValid()) notesSectionInput.contentEditable = "false";
}
//-----------------------------------------------------------------------------
function saveNoteEvent(e){
    if (e.type === "click" && e.target.classList.contains('saveNoteButton') ){
        const saveNoteButon = e.target;
        const note = saveNoteButon.parentNode.querySelector('.notesSectionInput').innerHTML;
        const idWorkout = workoutContainer.dataset.idWorkout;
        const buttonText = saveNoteButon.querySelector('.saveNoteButtonText');
        f.post(end.SAVE_SESSION_NOTE, {idWorkout, note})
            .then(res=>{
                if (res === "success"){
                    buttonText.innerText = `note saved`;   
                    saveNoteButon.classList.add('saved');
                } else {
                    buttonText.innerText = `
                    exceeeds 1500 char limit.`;   
                    saveNoteButon.classList.add('notSaved');
                }
            }
        ).catch(err=>{
            console.error(err) ;
        });
    }
    if (e.type === "input" && e.target.classList.contains('notesSectionInput')) {
        const saveNoteButton = e.target.parentNode.querySelector('.saveNoteButton');
        const saveNoteButtonText =  e.target.parentNode.querySelector('.saveNoteButtonText');
        if (saveNoteButton.classList.contains('saved')){
            saveNoteButton.classList.remove('saved');
            saveNoteButtonText.innerText = `save note`;
        }
        if (saveNoteButton.classList.contains('notSaved')){
            saveNoteButton.classList.remove('notSaved');
            saveNoteButtonText.innerText = `save note`;
        }
    }
}
//-----------------------------------------------------------------------------
function qualifierClickEven(e){
    if (e.type === "click" && e.target.classList.contains('UpdatequalifierIcons') ){
        e.target.classList.toggle('highlighted')
    }
}
//-----------------------------------------------------------------------------
function closeWorkoutDash(e){
    if (e.type === "click" && e.target.id === "workoutDashX"){
        workoutContainer.style.display = "none";
    }
}
//-----------------------------------------------------------------------------
async function expandSetEvent(e){
    if (!await accessLevelValid()) return; 
    // expand set box and show update form
    if (e.type === "click" && e.target.classList.contains("set") ){
        const set = e.target;
        set.classList.toggle("setExpand");
        const setID = set.dataset.setID; 
        const form = document.querySelector(`#setUpdateForm${setID}`);
        form.classList.toggle("setUpdateFormVisible");
        return;
    } 
}
//-----------------------------------------------------------------------------
function showVideo(set){
    const videoWrapper = set.querySelector('.setVideoWrapper');
    if (videoWrapper){ // if video present and  has already been loaded once
        videoWrapper.classList.toggle('visible');
    }
    else if (set.dataset.videoLink !== 'null'){  // if video not loaded and present...
        addSetVideo(set, set.dataset.videoLink);      // make video wrapper 
        set.querySelector('.setVideoWrapper').classList.toggle('visible');
    }
}
//-----------------------------------------------------------------------------
// helper method to make the UI exercise Row
//-----------------------------------------------------------------------------
async function fillExerciseRow(liftInfo){
    const newRow = createExerciseRow(liftInfo.exercise);        // new exercise
    createExerciseBox(newRow,liftInfo);               // make a new row with it
    await loadSets(newRow, liftInfo);           // at least 1 set done, add set
}
//-----------------------------------------------------------------------------
// load a set into exercise row from the workout loaded form DB 
//-----------------------------------------------------------------------------
// data looks like {exercise info{}, sets[setinfo{}]
async function loadSets(newExerciseRow, data){
    for (const set of data.sets){
        await makeNewSetBox(set, data, set.set, newExerciseRow);
    }
}
//-----------------------------------------------------------------------------
// method to create the HTML for a new Set being added to an Exercise Row
//-----------------------------------------------------------------------------
async function makeNewSetBox(setInfo, liftInfo, setNumber, curExerciseRow){
    if (!setInfo.setID){   // if new setbox is being created from the front end
        setInfo = liftInfo;                // there will not be any setInfo yet
    }               // but there will be some setInfo like exercise information
    const newSet = document.createElement('div');
    newSet.classList.add("set");
    newSet.classList.add(`${liftInfo.exercise}`);
    newSet.setAttribute("id",`setID${setInfo.setID}`);
    newSet.dataset.idExercise = liftInfo.exerciseID;
    newSet.dataset.setID = `${setInfo.setID}`;
    newSet.dataset.idWorkout = liftInfo.idWorkout;
    newSet.dataset.videoLink = setInfo.videoLink;
    newSet.insertAdjacentHTML("beforeend",CreateSetTemplate(setInfo));
    newSet.appendChild(createSetUpdateForm(setInfo, liftInfo));
    if (await accessLevelValid()){
        newSet.appendChild(CreateRemoveSetButton(liftInfo, setInfo));
    }
    newSet.appendChild(addSetNumberToSetBox(setNumber, setInfo));
    // check if set is a Pr
    if (setInfo.weight > 0 && setInfo.reps > 0){
        isSetPr(liftInfo.exerciseID, currLifter.id, setInfo.weight, setInfo.reps, newSet);
    }
    setQualifiersForSet(setInfo, newSet);
    // Set Comment 
    newSet.insertAdjacentHTML("beforeend", 
        `
        <div class="setCommentWrapper" id="commentsFor${setInfo.setID}" data-id-set="${setInfo.setID}">
            <div class="setCommentButton">comments</div>
        </div>
        `
    );
    const setCommentWrapper = newSet.querySelector('.setCommentWrapper');
    getNumberOfNotes(setInfo.setID, setCommentWrapper);
    showVideo(newSet);
    curExerciseRow.appendChild(newSet);
}
//-----------------------------------------------------------------------------
function setQualifiersForSet(setInfo, newSet){
    if (setInfo.paused){
        newSet.querySelector('#UpdatepausedIcon').classList.add('highlighted');
        newSet.querySelector('#pausedIcon').classList.add('highlighted');
    }
    if (setInfo.belt){
        newSet.querySelector('#UpdatebeltIcon').classList.add('highlighted');
        newSet.querySelector('#beltIcon').classList.add('highlighted');
    }
    if (setInfo.workingSet){
        newSet.querySelector('#UpdateworkingSetIcon').classList.add('highlighted');
        newSet.querySelector('#workingSetIcon').classList.add('highlighted');
    }
    if (setInfo.unilateral){
        newSet.querySelector('#UpdateunilateralIcon').classList.add('highlighted');
        newSet.querySelector('#unilateralIcon').classList.add('highlighted');
    }

}
//-----------------------------------------------------------------------------
function addSetVideo(setElement, videoFileName){
    const setId = setElement.dataset.setID;
    setElement.insertAdjacentHTML("afterbegin", 
        `<div class="setVideoWrapper">
            <div class="videoMenuWrapper">
             
            </div>
            <video class="setVideoPlayer" id="videoForSet${setId}" controls>
                <source src="${videoFileName}" type="video/mp4">
            </video>
        </div>`
    )
}
//-----------------------------------------------------------------------------
// if set updated, query the DB
//-----------------------------------------------------------------------------
async function updateSetEvent(e){
    e.preventDefault();
    if (!await accessLevelValid()) return;
    if (e.target.classList.contains("setUpdate")){
        updateAset(e)
    }
    if (e.target.classList.contains('nameSetForm')){
        updateSessionName(e);
    }
}
//-----------------------------------------------------------------------------
// user clicks the check/update button and triggers this 
//-----------------------------------------------------------------------------
function updateAset(e){
    e.preventDefault();
    const setUpdateForm = e.target; // get all the info from the user input
    const setBox     = setUpdateForm.closest(".set");
    const idWorkout  = setBox.dataset.idWorkout;
    const idSet      = setUpdateForm.dataset.setID;
    const idExercise = e.target.parentNode.dataset.idExercise; 
    const setWeight  = setUpdateForm.querySelector(`#weight${idSet}`).value;
    const setReps    = setUpdateForm.querySelector(`#reps${idSet}`).value;
    const setRPE     = setUpdateForm.querySelector(`#rpe${idSet}`).value;
    // true false checks 
    const paused     = setBox.querySelector('#UpdatepausedIcon').classList.contains('highlighted');
    const belt       = setBox.querySelector('#UpdatebeltIcon').classList.contains('highlighted');
    const workingSet = setBox.querySelector('#UpdateworkingSetIcon').classList.contains('highlighted');
    const unilateral = setBox.querySelector('#UpdateunilateralIcon').classList.contains('highlighted');

    const updateObj  = {
            idSet, 
            setWeight,
            setReps, 
            setRPE, 
            idWorkout, 
            paused, 
            belt, 
            workingSet, 
            unilateral
        }
    updateSet(updateObj);    
}
//-----------------------------------------------------------------------------
// user changes the name of a workout and triggers this
//-----------------------------------------------------------------------------
function updateSessionName(e){
    e.preventDefault();
    const nameSetForm = document.querySelector('.nameSetForm');
    const newTitle = nameSetForm.querySelector('.sessionNameInput').value;
    const idWorkout = nameSetForm.dataset.idWorkout;
    console.log(idWorkout, newTitle);
    f.post(end.UPDATE_SESSION_NAME, {idWorkout, newTitle})
    .then(res=>{
        console.log("session name successfully updated");
    })
    .catch(err=>{
        console.error(err);
    });
}
//-----------------------------------------------------------------------------
// check to see if the set being loaded is a PR
//-----------------------------------------------------------------------------
function isSetPr(idExercise, idUser, setWeight, setReps, setBox){ //compare set
    let maxWeight = setWeight;   // to all sets of this exercise. see if either
    let bestWeightAtTheseReps = setWeight; // all time weight / all time rep pr
    f.post(end.GET_PR_DATA_FOR_LIFT, {idUser, "lift" : idExercise})
        .then(data=>{
            for (const liftData of data){ 
                if (parseInt(liftData.weight) > parseInt(maxWeight)){
                    maxWeight = liftData.weight;             // all time weight
                } 
                if (parseInt(liftData.reps) === parseInt(setReps) && 
                    parseInt(liftData.weight) > parseInt(setWeight)){
                    bestWeightAtTheseReps = liftData.weight;    // all time rep
                    break;            // first rep match will be highest weight
                }
            }
            if (setWeight === maxWeight || bestWeightAtTheseReps === setWeight){
                setBox.classList.add("prSet"); // then we have a pr of some sort
            }
        })
        .catch(err=>console.error(err));
}
//-----------------------------------------------------------------------------
// method updates the database with new set info
//-----------------------------------------------------------------------------
function updateSet(updateObj){
    f.put(end.WORKOUT_ENDPOINT, updateObj)
        .then(data=>{
            const rawData = (document.querySelector(".trainingDate")).dataset.dateInfo;
            const dateInfo = JSON.parse(decodeURIComponent(rawData)); 
            updateDashesOnChange(dateInfo, updateObj.idWorkout, curYear, curMonth, curlastDay)
        }) 
        .catch(err=>console.error(err));
}
//-----------------------------------------------------------------------------
// this method will add a new set to an exercise row
//-----------------------------------------------------------------------------
async function addSet(curExerciseRow, liftInfo){
    if (!await accessLevelValid()) return;
    // first query the db and create a new set
    const i = document.querySelectorAll(`.${liftInfo.exercise}`).length;
    createNewDBset(liftInfo, i+1, curExerciseRow);
}
//-----------------------------------------------------------------------------
function createNewDBset(curliftInfo, setNumber, curExerciseRow){
    const SetNumber = setNumber;
    const idExercise = curliftInfo.exerciseID;
    const idWorkout = curliftInfo.idWorkout;
    f.post(end.SET_ENDPOINT, {SetNumber, idExercise, idWorkout})
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
        belt        : newSetInfo.belt,
        workingSet  : newSetInfo.workingSet,
        unilateral  : newSetInfo.unilateral,
        reps        : newSetInfo.setReps,
        rpe         : newSetInfo.setRPE,
        setID       : newSetInfo.idSet,
        videoLink   : newSetInfo.setVideo,
        weight      : newSetInfo.setWeight,
        idWorkout   : newSetInfo.idWorkout,
    }
}

//-----------------------------------------------------------------------------
// if set remove button clicked, remove set from DB
//-----------------------------------------------------------------------------
async function removeSetEvent(e){
    if (!await accessLevelValid()) return;
    if (e.target.classList.contains("setRemove")){
        const idSet         = e.target.dataset.setID;
        const idWorkout     = e.target.dataset.idWorkout;
        const idExercise    = e.target.dataset.exerciseID;
        const rawData       = (document.querySelector(".trainingDate"))
                                .dataset.dateInfo;
        const dateInfo       = JSON.parse(decodeURIComponent(rawData)); 
        e.target.closest(".set").remove();    // remove the setBox from the DOM
        f.delete(end.WORKOUT_ENDPOINT,{idSet,idWorkout,idExercise})
            .then(response=>{                            // reorder set numbers
                f.put(end.REORDER__SET_ENDPOINT, {idWorkout,idExercise})
            })
            .catch(err=>console.error(err))
            .finally(()=>{
                updateDashesOnChange(dateInfo, idWorkout, curYear, curMonth, curlastDay)
            });
    }
}
//-----------------------------------------------------------------------------
// remove your own comment from a set
//-----------------------------------------------------------------------------
function removeCommentEvent(e){
    if (e.target.classList.contains('removeSetMsg')){
        const idMessage = e.target.dataset.idMessage;
        f.post(end.REMOVE_SET_MSG, idMessage)
        .then(res=>{
            const setCommentWrapper = e.target.closest('.setCommentWrapper');
            const idSet = setCommentWrapper.dataset.idSet;
            getSetNotes(idSet, setCommentWrapper);
        })
        .catch(err=>console.error(err));
    }
}
//-----------------------------------------------------------------------------
// before inserting exercise on a date, check if workout exists on that date
//-----------------------------------------------------------------------------
export function checkIfWorkoutExistsOnDate(selectedExercise){
    let idWorkout = null;
    const idUser = currLifter.id;
    const rawData = (document.querySelector(".trainingDate"))?.dataset.dateInfo;
    if(!rawData) return; // means user has not clicked on date on the calendar
                                   // but exericse selection box is still open
    const Date = JSON.parse(decodeURIComponent(rawData)); 

    f.put(end.CHECK_IF_WORKOUT_EXISTS, Date, idUser)
        .then(res=>{
            if (res.success){
                idWorkout = res.idWorkout;
                inserNewExerciseIntoWorkout(selectedExercise, idWorkout);
            } else {
                f.post(end.CREATE_WORKOUT_ENDPOINT,Date)
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
    f.post(end.INSERT_NEW_EXERCISE_ENDPOINT,{idWorkout, idExercise, SetNumber})
        .then(res=>{
            updateDashesOnChange(dateInfo, idWorkout, curYear, curMonth, curlastDay);
        })
        .catch(err=>console.error(err));  
}


//-----------------------------------------------------------------------------
// create workout input grid
//-----------------------------------------------------------------------------
export function createWorkoutGrid(dateInfo){
    workoutContainer.style.display = "flex";
    workoutContainer.innerHTML = ``;   
    workoutContainer.addEventListener("click", workoutDashClickEvents);
    workoutContainer.addEventListener("submit", updateSetEvent);
    workoutContainer.addEventListener("input", workoutDashClickEvents);
    workoutContainer.addEventListener("dragover", dragOverFileEvent);
    workoutContainer.addEventListener("dragleave", dragLeaveFileEvent);
    workoutContainer.addEventListener("drop", dropFileEvent);
    fillWorkoutDate(dateInfo); 
    scrollToWorkout();
}
//-----------------------------------------------------------------------------
async function dragOverFileEvent(e){
    e.preventDefault();
    if (e.target.classList.contains('set')){
        const set = e.target;
        set.classList.add('videoDrag');
    }
}
//-----------------------------------------------------------------------------
async function dragLeaveFileEvent(e){
    e.preventDefault();
    if (e.target.classList.contains('set')){
        const set = e.target;
        set.classList.remove('videoDrag');
    }
}
//-----------------------------------------------------------------------------
async function dropFileEvent(e){
    e.preventDefault();
    // put this here otherwise the await makes the data clear and video is null
    const video = e.dataTransfer.files[0]; // returns array, get first item
    if (! await accessLevelValid()) return;
    if (e.target.classList.contains('set')){
        const set = e.target;
        set.classList.toggle('videoDrag');                      // de-highlight
        const setId = set.dataset.setID;
        const videoObject = new FormData();     // video sent in special format
        videoObject.append('video', video); // basically a map.create key/value
        videoObject.append('setId', setId);
        videoObject.append('userId', currLifter.id);
        const res = await fetch(end.UPLOAD_SET_VIDEO, { 
            method: 'POST',
            body: videoObject
        })
        const link = await res.json();
                                // get link to video when done 
        addSetVideo(set, link);                     // then attach to below 
        const setVideoWrapper = set.querySelector('.setVideoWrapper');
        setVideoWrapper.classList.add('visible');    // vid opens when done
    }
}
//-----------------------------------------------------------------------------
function addExerciseEvent(e){
    if (e.target.id === "cursorForworkoutDash"){
        workoutContainer.insertAdjacentHTML("beforeend",createExerciseDash(workoutContainer));
        fillOutExerciseSelectMenu(workoutContainer);
        return;
    }
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
    setRemoveButton.dataset.idWorkout = liftInfo.idWorkout; 
    setRemoveButton.dataset.exercise = liftInfo.exercise;
    setRemoveButton.dataset.exerciseID = liftInfo.exerciseID;
    setRemoveButton.innerHTML = `●`;
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
    newExercise.classList.add(`${liftInfo.category}`);
    newExercise.insertAdjacentHTML("beforeend",`<p>${liftInfo.exercise}</p>`);
    newExercise.insertAdjacentHTML("beforeend", 
        `<div class = "addSet"></div>`);
    newExercise.dataset.idExercise = liftInfo.exerciseID;
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
    <div class="sessionTitle">Session:&nbsp</div>
    <div class="trainingDate" data-date-info="${safeData}">
        ${dateInfo.dow.toUpperCase()}
        ${dateInfo.month} 
        ${dateInfo.day} 
        ${dateInfo.year}
    </div>
    <div id="workoutDashX">●</div>`;
    workoutContainer.appendChild(workoutHeader);
}
//-----------------------------------------------------------------------------
// HTML for the form that will be used to update a set
//-----------------------------------------------------------------------------
function createSetUpdateForm(liftInfo, moreLiftInfo){
    const updateForm = document.createElement('div');
    updateForm.classList.add(`setUpdateForm`);
    updateForm.setAttribute("id",`setUpdateForm${liftInfo.setID}`);
    updateForm.innerHTML = setUpdateFormTemplateHTML(liftInfo, unit);
    updateForm.dataset.idExercise = moreLiftInfo.exerciseID; // might not need
    // set all the qaalifier information here 
    const belt = liftInfo.belt;
    const workingSet = liftInfo.workingSet;
    const unilateral = liftInfo.workingSet;
    const paused = liftInfo.paused;

    return updateForm;
}
//-----------------------------------------------------------------------------
export function scrollToWorkout(){
    setTimeout(()=>{
         document.querySelector('.workoutHeader').scrollIntoView({ top: 0, behavior: 'smooth'});
    },200); 
}
//-----------------------------------------------------------------------------
// place to update the workout's name in DB, placed below date in the dash
//-----------------------------------------------------------------------------
async function nameSession(liftInfo){
    const sessionNameWrapper = 
    `
    <div class="sessionNameWrapper">
        ${sessionTitleFormHTML(liftInfo)}
    </div>
    `
    const workoutHeader = document.querySelector('.workoutHeader');
    workoutHeader.insertAdjacentHTML("afterend", sessionNameWrapper);
    if (! await accessLevelValid()){         // prevent unauthorized edits
        const nameSetButton = document.querySelector('.nameSetButton');
        const sessionNameInput = document.querySelector('.sessionNameInput');
        nameSetButton.parentElement.removeChild(nameSetButton);
        sessionNameInput.readOnly = 'true';
    }
}
//-----------------------------------------------------------------------------
// add Set note
//-----------------------------------------------------------------------------
export function addCommentToSet(e){
    if ( e.type === "click" && e.target.classList.contains("setCommentButton") ){
        const idSet = e.target.closest('.set').dataset.setID;
        const commentSection = e.target.parentNode;//get main comment container

        // toggle visibility of comment section if comment button pressed again
        if (commentSection.querySelector('.commentWrapper')){
            commentSection.innerHTML = ``;
            commentSection.insertAdjacentHTML("beforeend", `<div class="setCommentButton">comments</div>`);
            getNumberOfNotes(idSet, commentSection);
            return;
        }
        // load any previous notes that exist for this set
        getSetNotes(idSet, commentSection);
        // create the add new comment section 
        commentSection.insertAdjacentHTML("beforeend", 
        `<div class="commentWrapper" id=commentsFrom${loggedinLifter.id}></div>`);
        const commentWrapper = commentSection.querySelector('.commentWrapper');
        if (commentWrapper.querySelectorAll('.commenterName').length === 0 ){
            commentWrapper.insertAdjacentHTML("beforeend",// add commenters name
                `<div class="commenterName">${loggedinLifter.userName} </div>` 
            )
        }
        commentWrapper.insertAdjacentHTML("beforeend", `
            <div class="inputComment" contenteditable=true></div>
            <div class="submitComment" data-comment-from=${loggedinLifter.id}>comment</div>
            `);
    }
}
//-----------------------------------------------------------------------------
// submit Set note
//-----------------------------------------------------------------------------
export async function submitCommentForSet(e){
     if (e.type === "click" && e.target.classList.contains("submitComment")) {
        const idCommenter =  e.target.dataset.commentFrom;
        const commentText = e.target.parentNode.querySelector('.inputComment').innerText; 
        if (commentText === ""){
            console.log("nothing to post")
            return; // if nothing to post, return
        }     
        const idSet = e.target.closest('.set').dataset.setID;
        const commentSection = e.target.parentNode;//get main comment container
        // can now run quer to save the comment for this set
        f.post(end.SEND_SET_MESSAGE, {idCommenter, commentText, idSet})
        .then(res=>{
            e.target.parentNode.querySelector('.inputComment').innerText = "";
            getSetNotes(idSet,commentSection);
        })
     }
}
//-----------------------------------------------------------------------------
// get all the notes that a set has
//-----------------------------------------------------------------------------
export async function getSetNotes(idSet, commentSection){
    f.post(end.GET_SET_MSGS, idSet)
    .then(msgs=>{
        clearPrevNotes(idSet);
        for (const msg of msgs){
            commentSection.insertAdjacentHTML("beforeend",
            `
            <div class="prevMsgWrapper">
                <div class="setMsgTextWrapper" id="msgWrapperFor${msg.idMessage}">
                    <div class="setMsgSender">${msg.userName}</div>
                </div>
                <div class="setMsgDate">${msg.msgDate}</div>
                <div class="setMsgText">${msg.message}</div>
            </div>
            `);
            if (msg.idUser === loggedinLifter.id || loggedinLifter.id === currLifter.id){
                const setMsgTextWrapper = document.getElementById(`msgWrapperFor${msg.idMessage}`);
                setMsgTextWrapper.insertAdjacentHTML("beforeend", 
                `<div class="removeSetMsg" data-id-message="${msg.idMessage}">remove</div>`);
            }
        }
        getNumberOfNotes(idSet, commentSection);
    })
    .catch(err=>console.error(err));
}
//-----------------------------------------------------------------------------
function getNumberOfNotes(idSet, commentSection){
    f.post(end.GET_SET_MSGS, idSet)
    .then(msgs=>{
        let commentButton = commentSection.querySelector('.setCommentButton');
        if (!commentButton){
            commentButton = commentSection.parentNode.querySelector('.setCommentButton');
        }
        commentButton.innerHTML = `comments (${msgs.length})`;
    })
    .catch(err=>console.error(err));
}
//-----------------------------------------------------------------------------

function clearPrevNotes(idSet){
    const commentSection = document.getElementById(`commentsFor${idSet}`);
    const prevmsgs = commentSection.querySelectorAll('.prevMsgWrapper');
    for (const msg of prevmsgs){
        msg.parentNode.removeChild(msg);
    }
}