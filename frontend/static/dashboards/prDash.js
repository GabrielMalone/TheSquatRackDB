
import { endpoint as c, DoW, months, PR_DASH_VARIABLES as p } from "../config.js";
import { fillCalendar } from "./calendarDash.js";
import { createrWorkoutHeader, getWorkoutFromWokroutID } from "./workoutDash.js";
import { fillOutExerciseSelectMenu, createExerciseDash } from "./exerciseSelectDash.js";
import { f } from "../lifterSidebar.js";
import { createCursor } from "../cursor.js";

let repRange = 20;

//-----------------------------------------------------------------------------
// creates the pr chart and fetches the data to fill in the chart
//-----------------------------------------------------------------------------
export async function createPrDash(exerciseList, idUser){
    document.querySelector(`.${p.prDashClass}`).innerHTML = ``;    
    const prDash = initPrDash(exerciseList.length);    // clear any prev dash ^
    for (const liftID of exerciseList) {    // get info for exercises passed in
        const exerciseInfo = await f.post(c.GET_EXERCISE_INFO, liftID);
        const curLiftRow = buildLiftRow(exerciseInfo, prDash, idUser, liftID);
        f.post(c.GET_PR_DATA_FOR_LIFT, {idUser, "lift" : liftID})//pr data
        .then(prs=>{
            console.log(prs);
            prs.forEach(pr=>{        //iterate prs, get corresponding box by id
                fillInRepPRBoxes(pr, idUser, exerciseInfo, curLiftRow, liftID);
            });
        })
        .catch(err=>{
            console.error(err); 
        });
    }
    buildPrDashHeader(prDash);
    createCursor(prDash);
    prInfoClick(prDash);                            // listen for clicks on PRs
}
//-----------------------------------------------------------------------------
// EVENTS for clicking on a PR - load the workout in which PR happened
//-----------------------------------------------------------------------------
function prInfoClick(prDash){
    prDash.addEventListener("click", prDashClickEvent);
}
//-----------------------------------------------------------------------------
function prDashClickEvent(e){
    clickPrEvent(e);
    createDashFromCursorClick(e);
}
//-----------------------------------------------------------------------------
function createDashFromCursorClick(e){
    if (e.target.id === "cursorForprDashBoard"){
        const prDash = document.querySelector(`.${p.prDashClass}`);
        prDash.insertAdjacentHTML("beforeend",createExerciseDash(prDash));
        fillOutExerciseSelectMenu(prDash);
        return;
    }  
}
//-----------------------------------------------------------------------------
function clickPrEvent(e){
    if (e.target.classList.contains("prPresent")){
        highlightPRinCalendarAndGetPRworkout(e);
    }
}
//-----------------------------------------------------------------------------
function highlightPRinCalendarAndGetPRworkout(e){
    const [dateInfo, year, month, prDay, lastday, idWorkout ] = getPRdata(e);
    fillCalendar(year, month, lastday); // change calendar to match pr date
    const days = [...document.querySelectorAll(".day")];
    days.forEach(day=>{                                 // highlight the pr day 
        day.classList.remove("daySelected", "prDateHighlighted");
        if (parseInt(day.dataset.day)   ===  parseInt(prDay) && 
            parseInt(day.dataset.month) ===  parseInt(month)){
            day.classList.add("prDateHighlighted"); 
        }
    });
    createrWorkoutHeader(dateInfo);           // get workout where pr happened
    getWorkoutFromWokroutID(idWorkout);
}
//-----------------------------------------------------------------------------
function getPRdata(e){
    const curPR = e.target;      
    const prDate = curPR.dataset.date;
    const date = new Date(prDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const prDay = date.getDate();
    const idWorkout = curPR.dataset.idWorkout;
    const idUser = curPR.dataset.idUser;
    const lastday = new Date(year, month + 1, 0).getDate();
    const dateInfo = {// this data needed down line for the queries that result
        "dow"   : DoW[date.getDay()],  // getworkout title and get workout data
        "month" : months[month],
        "monthNumber" : month,
        "day"   : prDay,
        "year"  : year,
        "lifterID" : idUser
    }
    return [dateInfo, year, month, prDay, lastday, idWorkout]
}
//-----------------------------------------------------------------------------
// helper methods for the createPrDash ^
//-----------------------------------------------------------------------------
function initPrDash(exerciselistLength){    
    const prDash = document.querySelector(`.${p.prDashClass}`); 
    if (exerciselistLength === 0 ) return prDash;   // build the dash headers ^
    const repsTitle = buildRepsTitle(prDash);
    buildRepsHeader(repsTitle);                  // build the rows of exercises 
    return prDash;
}
//-----------------------------------------------------------------------------
function buildPrDashHeader(prDash){
    prDash.insertAdjacentHTML("afterbegin",
        `<div class="${p.prDashHeaderClass}">
            <div class="${p.prDashHeaderTitleClass}">${p.prDashText}</div>
            <div class="minimizer" id="${p.prDashMinimizerId}">${p.prDashMinimizerIcon}</div>
        </div>`);
    const width = prDash.offsetWidth;
    const prDashHeader = document.querySelector(`.${p.prDashHeaderClass}`);
    prDashHeader.style.width = `${width}px`;
    const miniMizer = document.getElementById(p.prDashMinimizerId);
    miniMizer.addEventListener("click", minimizePrDash);
}
//-----------------------------------------------------------------------------
function minimizePrDash(){
    const prDash = document.querySelector(`.${p.prDashClass}`);
    prDash.classList.toggle(`${p.prDashVisibleClass}`);
}
//-----------------------------------------------------------------------------
function buildRepsTitle(prDash){
    const repsTitle = document.createElement('div');
    repsTitle.classList.add(`${p.prRepsTitleClass}`);
    repsTitle.classList.add(`${p.prCellClass}`);
    repsTitle.innerHTML = ``;
    prDash.append(repsTitle);
    return repsTitle;
}
//-----------------------------------------------------------------------------
function buildRepsHeader(repsTitle){
    for (let i = 0 ; i <= repRange ; i ++ ){
        const repNumberBox = document.createElement('div');
        repNumberBox.setAttribute("id", `${p.prDashNBoxInHeadClass}_${i}`);
        repNumberBox.classList.add(`${p.prDashNBoxInHeadClass}`);
        repNumberBox.classList.add(`${p.prCellClass}`);
        if (i > 0) repNumberBox.innerHTML = 
            `<div class="${p.repNumInHeader}">${i}</div>`;
        repsTitle.append(repNumberBox);
    }    
}
//-----------------------------------------------------------------------------
function buildRepPrBox(lift, rep){
    const repPRbox = document.createElement('div');
    if (rep === 0){ // place name of lift at start
        repPRbox.classList.add(`${p.repPRliftNameBoxClass}}`);
        repPRbox.innerHTML = `<div class="${p.repPRliftNameWrapClass}">${lift.abbrev}</div>`;
        repPRbox.classList.add(`${p.prCellClass}`);
        return repPRbox;
    }  
    repPRbox.classList.add(`${p.repPRboxClass}`); 
    repPRbox.setAttribute("id", `${lift.abbrev}_rep_${rep}`);
    repPRbox.classList.add(`${p.prCellClass}`);
    return repPRbox;

}
//-----------------------------------------------------------------------------
function buildLiftRow(lift, prDash, idUser, liftID){
    const liftRow = document.createElement('div');
    liftRow.classList.add(`${p.repPRrowClass}`);
    liftRow.setAttribute("id", `${lift.abbrev}PR`);
    prDash.append(liftRow);
    for (let i = 0 ; i < repRange + 1 ; i ++ ){
        liftRow.append(buildRepPrBox(lift, i, idUser, liftID));
    }
    return liftRow;
}
//-----------------------------------------------------------------------------
function formatBackendDateData(BackendPrDate){
    const date = new Date(BackendPrDate);
    const formattedDate = date.toLocaleDateString("en-US", {
        timeZone: "UTC",             // to prevent day changes with 00:00 times
        year: "numeric",                           // due to earlier time zones
        month: "short",
        day: "numeric"
    });
    return formattedDate
}
//-----------------------------------------------------------------------------
function fillInRepPRBoxes(pr, idUser, exerciseInfo, curLiftRow, idExercise){ 
    if(pr.reps > repRange || pr.reps === 0) return;      // all backend data ^^
    const curLift = exerciseInfo.abbrev;
    const repBox = curLiftRow.querySelector(`#${curLift}_rep_${pr.reps}`);
    const formattedDate = formatBackendDateData(pr.date);
    if (! repBox.innerHTML && pr.weight){
        repBox.dataset.weight = pr.weight;          // data gets workout for pr
        repBox.dataset.reps = pr.reps;
        repBox.dataset.idUser = idUser;                  // and to make tooltip
        repBox.dataset.idExercise = idExercise;
        repBox.dataset.date = formattedDate;
        repBox.dataset.idWorkout = pr.idWorkout;        // video link in future
        repBox.innerHTML = `<div class="prWeight">${pr.weight}</div>`;
        repBox.classList.add("prPresent");
        repBox.append(makePrToolTip(exerciseInfo.lift,pr.weight,pr.reps,formattedDate));
    } 
}
//-----------------------------------------------------------------------------
function makePrToolTip(lift, weight, reps, formattedDate){

    const toolTipWrapper = document.createElement('div');
    toolTipWrapper.classList.add("prToolTip");

    const toolTipDate = document.createElement('div');
    toolTipDate.classList.add('prToolTipDate');
    toolTipDate.classList.add('prToolTipdata');
    toolTipDate.innerHTML =`${formattedDate}`;

    const toolTipLift = document.createElement('div');
    toolTipLift.classList.add("prToolTipLift");
    toolTipLift.classList.add('prToolTipdata');
    toolTipLift.innerHTML= `${lift}`;

    const weightRepsWrapper = document.createElement('div');
    weightRepsWrapper.classList.add("prToolTipWeightsRepsWrapper");

    const toolTipWeight = document.createElement('div');
    toolTipWeight.classList.add("prToolTipWeight");
    toolTipWeight.classList.add('prToolTipdata');
    toolTipWeight.innerHTML = `${weight} x `;

    const toolTipReps = document.createElement('div');
    toolTipReps.classList.add("prToolTipReps");
    toolTipReps.classList.add('prToolTipdata');
    toolTipReps.innerHTML =`&nbsp${reps}`;
    toolTipWeight.insertAdjacentElement("beforeend",toolTipReps);

    weightRepsWrapper.append(toolTipWeight);
    weightRepsWrapper.append(toolTipReps);

    toolTipWrapper.append(toolTipDate,toolTipLift, weightRepsWrapper);

    return toolTipWrapper;
}