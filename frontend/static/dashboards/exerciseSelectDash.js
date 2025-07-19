import { currLifter, f, getLifterObject } from "../lifterSidebar.js";
import { endpoint as e } from "../config.js";
import { checkIfWorkoutExistsOnDate } from "./workoutDash.js";
import { createPrDash } from "./prDash.js";


//-----------------------------------------------------------------------------
// event for clicking on cursor. exercise dashboad visible/ fills out
//-----------------------------------------------------------------------------
export function fillOutExerciseSelectMenu(container){
    const ExerciseDash = document.getElementById(`exerciseDashFor${container.id}`);
    ExerciseDash.classList.toggle("addExerciseDashVisible");
    if (ExerciseDash.id === "exerciseDashForworkoutDash") {
        ExerciseDash.scrollIntoView({ behavior: 'smooth' })
    }
    if (ExerciseDash.id === "exerciseDashForprDashBoard") {
        const prDash = document.querySelector(".prDash");
        // prDash.scrollIntoView({ behavior: 'smooth' })
    }
    f.get(e.GET_EXERCISES_ENDPOINT)     // get all the exercises in the db
        .then(exercises=>{
            fillOutLiftCategoryMenus(exercises, ExerciseDash); // fill out dash
            selectedExerciselistener(ExerciseDash);  // add e-listeners to dash
        })
        .catch(err=>console.error(err));
}
//-----------------------------------------------------------------------------
// Fill out bench / squat / deadlift / accessory columns in the exercise window
//-----------------------------------------------------------------------------
function fillOutLiftCategoryMenus(exercises, ExerciseDash){
    exercises.forEach(eData=>{ 
        const liftCategory = eData.category;
        switch (liftCategory) {
            case "bench":
                fillOutLiftCategory(eData, ExerciseDash);
                break;
            case "squat":
                fillOutLiftCategory(eData, ExerciseDash);
                break;
            case "deadlift":
                fillOutLiftCategory(eData, ExerciseDash);
                break
            case "accessory":
                fillOutLiftCategory(eData, ExerciseDash);
                break
          }
    });
    // if (ExerciseDash.id === "exerciseDashForprDashBoard") {
    //     const prDash = document.querySelector(".prDash");
    //     prDash.scrollIntoView({ behavior: 'smooth' })
    // } else {
    //     ExerciseDash.scrollIntoView({ behavior: 'smooth' });
    // }
}
//-----------------------------------------------------------------------------
// helper function to fill out bench / squat / deadlift / accessory columns 
//-----------------------------------------------------------------------------
function fillOutLiftCategory(categoryData, ExerciseDash){
    const ExerciseMenu  = ExerciseDash.querySelector(`.${categoryData.category}ExerciseMenu`);
    ExerciseMenu.innerHTML = '';
    const liftsInCategory = categoryData.lifts_in_category;
    liftsInCategory.forEach(lift=>{
        ExerciseMenu.insertAdjacentHTML("beforeend", 
            `<li class="exerciseMenuItem" 
                data-lift-info='${encodeURIComponent(JSON.stringify(lift))}'
                data-dash='${ExerciseDash.id}'
                data-id-exercise='${lift.exerciseID}'>
                ${lift.exerciseName}
            </li>`);
    });
}
//-----------------------------------------------------------------------------
// listens to see if an item in workout area clicked on. 
//-----------------------------------------------------------------------------
function selectedExerciselistener(ExerciseDash){
    ExerciseDash.addEventListener("click", selectedExerciseEvents);
    ExerciseDash.addEventListener("mouseover", selectedExerciseEvents);
}
//-----------------------------------------------------------------------------
// all the events that can happen on the Exercise Dash
//-----------------------------------------------------------------------------
function selectedExerciseEvents(event){  

    // fills out description area of an exerice    
    fillExerciseDescriptionBox(event);

    // selects an exercise to add to a workout if container is workoutDash
    addExerciseToWorkout(event);
    
    // select an exercise to add to the PR tracker
    addExerciseToPrDash(event);

    // closes the exercise dashboard via the x button
    closeExerciseDash(event);
}
//-----------------------------------------------------------------------------
// helper functions for the event checks above
//-----------------------------------------------------------------------------
function fillExerciseDescriptionBox(event){
    if (event.type === "mouseover" && event.target.classList.contains("exerciseMenuItem")){
        // which exerciseDescriptionBox ?
        const targetDash = document.getElementById(event.target.dataset.dash);
        const DescriptionBox = targetDash.querySelector(".exerciseDescription");
        const exercise = event.target;
        const liftInfo = JSON.parse(decodeURIComponent(exercise.dataset.liftInfo));
        const Description = liftInfo.Description;
        DescriptionBox.innerHTML = Description;
        return;
    }
}
//-----------------------------------------------------------------------------
function addExerciseToPrDash(event){
    if (event.type === "click" 
        && isPrDashContainer(event)
        && event.target.classList.contains("exerciseMenuItem")) {
            // add the exercise to the PR menu
            // will need the exercise ID and the lifter's id
            const lifter = getLifterObject(currLifter.id);
            const idExercise = event.target.dataset.idExercise;
            const prCursor = document.getElementById('cursorForprDashBoard');
            lifter.prDashSelection = idExercise;
            createPrDash(lifter.prDashSelection, lifter.id);
    }
}
//-----------------------------------------------------------------------------
function addExerciseToWorkout(event){
    if (event.type === "click" && isWorkoutDashContainer(event) 
		&& event.target.classList.contains("exerciseMenuItem")) {
        const selectedExercise = event.target;
        checkIfWorkoutExistsOnDate(selectedExercise);
        return;
    }
}
//-----------------------------------------------------------------------------
function isWorkoutDashContainer(event){ 
	let node = event.target.parentNode;
	while (node.parentNode) { 	    // see if this menu a child of workoutDash
		if (node.id === "workoutDash"){
			return true;
		}
		node = node.parentNode;
	}
	return false;
}
//-----------------------------------------------------------------------------
function isPrDashContainer(event){ 
	let node = event.target.parentNode;
	while (node.parentNode) { 			 // see if this menu a child of prDash
		if (node.id === "prDashBoard"){
			return true;
		}
		node = node.parentNode;
	}
	return false;
}
//-----------------------------------------------------------------------------
function closeExerciseDash(event){
    if (event.type === "click" && event.target.id === "addExerciseX"){
		if (isWorkoutDashContainer(event)){ 
			const exerciseDash  = document.getElementById("exerciseDashForworkoutDash");
			exerciseDash.classList.remove("addExerciseDashVisible"); 
			return;
		} // otherwise is exercisedash for pr container
        const exerciseDash  = document.getElementById("exerciseDashForprDashBoard");
        exerciseDash.classList.remove("addExerciseDashVisible"); 
        return;
    }
}
//-----------------------------------------------------------------------------
// html to construct the exerciseDash
//-----------------------------------------------------------------------------
export function createExerciseDash(container){ 
	const exerciseDash =
    `<div class="addExerciseDash" id="exerciseDashFor${container.id}">
        <div class="addExerciseBoxHeader">
            <div id="addExerciseTitle">Select Exercise</div>
            <div id="addExerciseX">X</div>
        </div>
        <div class="exerciseSelectionWrapper">
            <div class="SquatCategory">
            <div class="CategoryHeader">Squat</div>
                <div class="exercisesInDB">
                <ul class="squatExerciseMenu"></ul>
                </div>
            </div>
            <div class="BenchCategory">
            <div class="CategoryHeader">Bench</div>
                <div class="exercisesInDB">
                <ul class="benchExerciseMenu"></ul>
            </div>
            </div>
            <div class="DeadliftCategory">
            <div class="CategoryHeader">Deadlift</div>
                <div class="exercisesInDB">
                <ul class="deadliftExerciseMenu"></ul>
            </div>
            </div>
            <div class="AccessoriesCategory">
            <div class="CategoryHeader">Accessory</div>
                <div class="exercisesInDB">
                <ul class="accessoryExerciseMenu"></ul>
                </div>
            </div>
        </div>
        <div class="exerciseDescriptionWrapper">
            <div class="exerciseDescription"></div>
        </div>
	</div>`
	return exerciseDash;
}