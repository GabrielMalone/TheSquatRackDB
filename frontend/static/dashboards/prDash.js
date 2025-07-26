
import { endpoint as c, DoW, months, PR_DASH_VARIABLES as p, DASH_HEADER_VARS as d } from "../config.js";
import { fillCalendar } from "./calendarDash.js";
import { createrWorkoutHeader, getWorkoutFromWokroutID, scrollToWorkout } from "./workoutDash.js";
import { fillOutExerciseSelectMenu, createExerciseDash } from "./exerciseSelectDash.js";
import { f, getLifterObject } from "../lifterSidebar.js";
import { createCursor } from "../cursor.js";
import { drawHistoricalChart } from "../charts/lifetimeLiftDataChart.js";
import { drawRepPrHistoryChart } from "../charts/repPrHistoryChart.js";

let repRange = 10;

//-----------------------------------------------------------------------------
// creates the pr chart and fetches the data to fill in the chart
//-----------------------------------------------------------------------------
export async function createPrDash(exerciseList, idUser){
    clearPreviousDash();
    const prDash = initPrDash(exerciseList.length);    // clear any prev dash ^
    const prData = await getPrsAndFillinRepPrChart(exerciseList, idUser, prDash);
    buildPrDashHeader(prDash);
    prInfoClick(); 
    createCursor(prDash);
    ifLiftHistoryDrawChart(prDash, prData);
    const prCursor = document.getElementById('cursorForprDashBoard'); 
    prCursor.scrollIntoView({behavior : "smooth"});
}
//-----------------------------------------------------------------------------
//  Determine if lift history exists for specific lift
//-----------------------------------------------------------------------------
function ifLiftHistoryDrawChart(prDash, prData){   // prData comes in as map {}
    for (let i = 0 ; i < Object.keys(prData).length ; i ++ ){// go through keys
        if (Object.values(prData)[i].length > 0){       // check values of keys
            drawHistoricalChart(prDash, prData)// if length val > 0 data exists     
            break;
        }
    }
}
//-----------------------------------------------------------------------------
async function getPrsAndFillinRepPrChart(exerciseList, idUser, prDash){
    let prData = {};

    for (const liftID of exerciseList) {    // get info for exercises passed in
        const exerciseInfo = await f.post(c.GET_EXERCISE_INFO, liftID);
        const liftName = exerciseInfo.lift;
        const curLiftRow = buildLiftRow(exerciseInfo, prDash, idUser, liftID);
        const prs = await f.post(c.GET_PR_DATA_FOR_LIFT, {idUser, "lift" : liftID})
        prs.forEach(pr=>{        //iterate prs, get corresponding box by id
            fillInRepPRBoxes(pr, idUser, exerciseInfo, curLiftRow, liftID);
        }); 
        prData[liftName] = prs;
    }
    
    return prData;        
}
//-----------------------------------------------------------------------------
function clearPreviousDash(){
    const cursorPr = document.getElementById('cursorForprDashBoard');
    if (cursorPr){
        cursorPr.parentNode.removeChild(cursorPr);
    }
    document.querySelector(`.${p.prDashClass}`).innerHTML = ``;   // clear dash
    let curPrDashHeader = document.getElementById(`${p.prDashHeaderId}`);
    if (curPrDashHeader){
        curPrDashHeader.innerHTML = ``;
        curPrDashHeader.parentNode.removeChild(curPrDashHeader);
    }
}

//-----------------------------------------------------------------------------
// EVENTS for clicking on a PR - load the workout in which PR happened
//-----------------------------------------------------------------------------
function prInfoClick(){
    const workoutContainer = document.querySelector('.lifterBox');
    workoutContainer.addEventListener("click", prDashClickEvent);
}
//-----------------------------------------------------------------------------
function prDashClickEvent(e){
    clickPrEvent(e);
    createDashFromCursorClick(e);
    removePrLift(e)
}
//-----------------------------------------------------------------------------
function removePrLift(e){
    if (e.target.classList.contains("prLiftName")){
        console.log(e.target.parentNode);
        const prLift = e.target.parentNode;                    // lift clicked for removal
        const liftId = prLift.dataset.liftId;    // need lift id to remove lift
        const idUser = prLift.dataset.idUser;                    // and user id
        const curLifter = getLifterObject(idUser);     // get curlifters object
        curLifter.removePrDashSelection(liftId); // remove lift from pr selects
        createPrDash(curLifter.prDashSelection, curLifter.id);  // rebuild dash
    }
}
//-----------------------------------------------------------------------------
function createDashFromCursorClick(e){
    if (e.target.id === "cursorForprDashBoard"){
        const curAddExerciseDash = document.getElementById('exerciseDashForprDashBoard');
        if (curAddExerciseDash){                    // clear any previous dashes
            curAddExerciseDash.innerHTML =``;
            curAddExerciseDash.parentNode.removeChild(curAddExerciseDash);
        }
        const prDash = document.querySelector(`.${p.prDashClass}`);
        prDash.insertAdjacentHTML("beforeend",createExerciseDash(prDash));
        fillOutExerciseSelectMenu(prDash);
    }  
}
//-----------------------------------------------------------------------------
function clickPrEvent(e){
    if (e.target.classList.contains("prPresent")){
        highlightPRinCalendarAndGetPRworkout(e);
        initDrawRepPrHistoryChart(e)
    }
}
//-----------------------------------------------------------------------------
// methods related to clickPR events ^
//-----------------------------------------------------------------------------
function initDrawRepPrHistoryChart(e){
    const idUser = e.target.dataset.idUser;
    const idExercise = e.target.dataset.idExercise;
    const reps = e.target.dataset.reps;
    const liftName = e.target.parentNode.querySelector('.prLiftName').innerHTML;
    const liftData = {idUser, idExercise, reps, liftName};
    drawRepPrHistoryChart(liftData);   
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
    scrollToWorkout();
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
    prDash.insertAdjacentHTML("beforebegin",
        `<div class="${p.prDashHeaderClass}", id="${p.prDashHeaderId}">
            <div class="${p.prDashHeaderTitleClass}">${p.prDashText}</div>
            <div class="${p.prDashMinimizerClass}" id="${p.prDashMinimizerId}">${p.prDashMinimizerIcon}</div>
        </div>`);
    const miniMizer = document.getElementById(p.prDashMinimizerId);
    miniMizer.addEventListener("click", minimizePrDash);
}
//-----------------------------------------------------------------------------
function minimizePrDash(){
    const prDash = document.querySelector(`.${p.prDashClass}`);
    const prDashCursor = document.getElementById('cursorForprDashBoard');
    prDashCursor.classList.toggle('cursorVisible');
    prDash.classList.toggle(`${p.prDashVisibleClass}`);
    const prDashMinimizerWrap = document.getElementById(`${p.prDashMinimizerId}`);
    if (prDashMinimizerWrap.innerHTML === `${d.minimizerIcon}`){
        prDashMinimizerWrap.innerHTML = `${d.expanderIcon}`;
    } else {
        prDashMinimizerWrap.innerHTML = `${d.minimizerIcon}`;
    }
}
//-----------------------------------------------------------------------------
function buildRepsTitle(prDash){
    const repsTitle = document.createElement('div');
    repsTitle.classList.add(`prDashRepRow`);
    repsTitle.innerHTML = ``;
    prDash.append(repsTitle);
    return repsTitle;
}
//-----------------------------------------------------------------------------
function buildRepsHeader(repsTitle){
    for (let i = 0 ; i <= repRange ; i ++ ){
        const repNumberBox = document.createElement('div');
        repNumberBox.classList.add(`${p.prCellClass}`);
        repNumberBox.classList.add(`${p.repNumBox}`);
        if (i === 0){
            repNumberBox.classList.add('blank');
        }
        if (i > 0) repNumberBox.innerHTML = 
            `<div class="${p.repNumInHeader}">${i}</div>`;
        repsTitle.append(repNumberBox);
    }    
}
//-----------------------------------------------------------------------------
function buildRepPrBox(lift, rep, idUser, liftId){
    const repPRbox = document.createElement('div');
    if (rep === 0){ // place name of lift at start
        repPRbox.classList.add(`${p.repPRliftNameBoxClass}`);
        repPRbox.dataset.idUser = idUser;
        repPRbox.dataset.liftId = liftId;
        repPRbox.innerHTML = 
        `<div class="${p.repPRliftNameWrapClass}">${lift.abbrev}</div>`;
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
export function formatBackendDateData(BackendPrDate){
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
//-----------------------------------------------------------------------------
export function createChartElement(dashContainer, chartName, chartTitle=""){
    let chartWrapper = document.querySelector('.prChartWrapper');
    // if (chartWrapper){   // all of this to get the chart to redraw in same spot
    //     chartWrapper.parentNode.removeChild(chartWrapper);
    // }     // later on if want multiple charts to be able to load, change this ^ 
    const chart = document.createElement("div");
    chart.classList.add("prChartWrapper");
    chart.classList.add("prChartWrapperVisible");
    chart.setAttribute("id", `prChartWrapperFor${chartName}`);
    chart.insertAdjacentHTML("beforeend",
        `<div class ="prChartTitleWrapper">
            <div class="prChartTitle">${chartTitle}</div>
            <div class="prChartX" id="prChartXfor${chartName}">X</div>
        </div>
        <canvas class="prChartCanvas" id="canvasFor${chartName}"></canvas>`);
        dashContainer.insertAdjacentElement("beforeend", chart); 
}