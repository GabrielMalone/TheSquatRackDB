
import { endpoint as c, DoW, months, PR_DASH_VARIABLES as p, DASH_HEADER_VARS as d, colors } from "../config.js";
import { fillCalendar } from "./calendarDash.js";
import { createrWorkoutHeader, getWorkoutFromWokroutID, scrollToWorkout } from "./workoutDash.js";
import { fillOutExerciseSelectMenu, createExerciseDash } from "./exerciseSelectDash.js";
import { f, getLifterObject } from "../lifterSidebar.js";
import { createCursor } from "../cursor.js";
import { hideLegendBoxes } from "./monthlyChartDash.js";

let repRange = 20;
let historicalChart = null;
const PRdatasets = [];

//-----------------------------------------------------------------------------
// creates the pr chart and fetches the data to fill in the chart
//-----------------------------------------------------------------------------
export async function createPrDash(exerciseList, idUser){

    document.querySelector(`.${p.prDashClass}`).innerHTML = ``; 
    let curPrDashHeader = document.getElementById(`${p.prDashHeaderId}`);
    if (curPrDashHeader){
        curPrDashHeader.innerHTML = ``;
        curPrDashHeader.parentNode.removeChild(curPrDashHeader);
    }
    const prDash = initPrDash(exerciseList.length);    // clear any prev dash ^

    let prData = {};

    for (const liftID of exerciseList) {    // get info for exercises passed in
        const exerciseInfo = await f.post(c.GET_EXERCISE_INFO, liftID);
        const liftName = exerciseInfo.lift;
        const curLiftRow = buildLiftRow(exerciseInfo, prDash, idUser, liftID);
        const prs = await f.post(c.GET_PR_DATA_FOR_LIFT, {idUser, "lift" : liftID})//pr data
        prs.forEach(pr=>{        //iterate prs, get corresponding box by id
            fillInRepPRBoxes(pr, idUser, exerciseInfo, curLiftRow, liftID);
        }); 
        prData[liftName] = prs;
    }        
    // create the historical datachart
    if (Object.keys(prData).length > 0){
        createChartElement("Historical PR Data", prDash);
        drawHistoricalPrChart(prData)
    }
    createCursor(prDash);
    buildPrDashHeader(prDash);
     // listen for clicks on PRs 
    prInfoClick(prDash);  
}
//-----------------------------------------------------------------------------
function createChartElement(chartTitle, prDash){
    let chartWrapper = document.querySelector('.prChartWrapper');
    if (chartWrapper){   // all of this to get the chart to redraw in same spot
        chartWrapper.innerHTML = ``;
    } 
    const chart = document.createElement("div");
    chart.classList.add("prChartWrapper");
    chart.classList.add("prChartWrapperVisible");
    chart.insertAdjacentHTML("beforeend",
        `<div class="prChartTitle">  </div>
        <canvas class="historicalPrChart"></canvas>`);
        prDash.insertAdjacentElement("beforeend", chart); 
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
    removePrLift(e)
}
//-----------------------------------------------------------------------------
function removePrLift(e){
    if (e.target.classList.contains("removePrLift")){
        const prLift = e.target;                    // lift clicked for removal
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
    adjustHeaderSizeToContent(prDash);
    const miniMizer = document.getElementById(p.prDashMinimizerId);
    miniMizer.addEventListener("click", minimizePrDash);
}
//-----------------------------------------------------------------------------
function minimizePrDash(){
    const prDash = document.querySelector(`.${p.prDashClass}`);
    prDash.classList.toggle(`${p.prDashVisibleClass}`);
    const prDashMinimizerWrap = document.getElementById(`${p.prDashMinimizerId}`);
    if (prDashMinimizerWrap.innerHTML === `${d.minimizerIcon}`){
        prDashMinimizerWrap.innerHTML = `${d.expanderIcon}`;
    } else {
        prDashMinimizerWrap.innerHTML = `${d.minimizerIcon}`;
    }
    adjustHeaderSizeToContent(prDash);
}
//-----------------------------------------------------------------------------
function adjustHeaderSizeToContent(prDash){
    const prDashHeader = document.getElementById(`${p.prDashHeaderId}`);
    const width = prDash?.offsetWidth;
    if (!width){
        prDashHeader.style.width = `1050px`;
    }
    prDashHeader.style.width = `${width}px`;
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
function buildRepPrBox(lift, rep, idUser, liftId){
    const repPRbox = document.createElement('div');
    if (rep === 0){ // place name of lift at start
        repPRbox.classList.add(`${p.repPRliftNameBoxClass}`);
        repPRbox.dataset.idUser = idUser;
        repPRbox.dataset.liftId = liftId;
        repPRbox.innerHTML = 
        `<div class="removePrLift" data-lift-id="${liftId}" data-id-user="${idUser}">-</div>
         <div class="${p.repPRliftNameWrapClass}">${lift.abbrev}</div>`;
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
// logic for drawing historical chart data
//-----------------------------------------------------------------------------
function drawHistoricalPrChart(dataforPr){
    const liftNames = Object.keys(dataforPr);
    const prData = Object.values(dataforPr);
    // pr Data is an array of arrays. each array contains pr objects for a lift
    // {date: "Tue, 01 Jul 2025 00:00:00 GMT", idWorkout: 1, reps: 1, weight: 901}
    // ....
    const prDatasets = [];          // array to hold the final chart js objects
    for (let i = 0 ; i < prData.length ; i ++ ){  // iterate through pr objects
        const color = colors[i];
        const prDataSet = prData[i];
        const liftName = liftNames[i];
        const weightAtReps = {};                                                // set this up so that weights are on x axis // and reps are on y axis // and frequncy of rep range completed at that weight is r 
        createWeightRepsObjects(weightAtReps, prDataSet, liftName) ;                      // all the weights a user has lifted for this exercise       
        const weightLabels = Object.keys(weightAtReps);                         // all reps completed at this weight for this exercise
        const repDataSets  = Object.values(weightAtReps);                       // set r radius based on how many times rep range hit for this weight
        setRadius(repDataSets);                                                 // how many times has a weight been done for this lift at these reps
        const datasetObj = createChartJSdatasetObject(weightLabels, repDataSets, color)// create the object that Chart js wants data : dataset [{},{},{}]  
        prDatasets.push(datasetObj);
    }    
    if (historicalChart){                              // destroy before redraw
        historicalChart.destroy();
    }

    historicalChart = new Chart(document.querySelector(`.historicalPrChart`), {
        type: 'bubble', 
        data: {     // map can take two arguments: item in arry, and index val
            datasets: prDatasets.flat() // need just one array of all datasetObjects
        },
        options: {
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        generateLabels: hideLegendBoxes,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const x = `${context.parsed.x} rep(s) x `;
                            const y = context.parsed.y;
                            const r = context.raw.date;
                            const name = context.raw.name;
                            return `${name} : ${x} ${y} on ${r}`; // No r here
                        }
                    }
                }
            },
            scales: {
                y: {
                    display: false,
                    grid: {
                        display: true,       // ✅ show horizontal grid lines
                        color: 'rgba(200, 200, 200, 0.2)', // optional: light gray lines
                        drawTicks: false     // optional: hide small tick marks
                    },
                    ticks: {
                        padding: 10
                    },
                },
                x: {
                    display: false,
                    min: 0,
                    ticks : {
                        stepSize: 5,
                        color: "gray",
                        font: {
                            size: 10 
                        },
                        padding: 0,
                    }
                },
            },
            layout: {
                padding: 0
            }
        },              
    }); 
}
//-----------------------------------------------------------------------------
// chart  helpers for formatting the chart data
//-----------------------------------------------------------------------------
function setRadius(repDataSets){
    for (let i = 0 ; i < repDataSets.length ; i ++){
        for (let j = 0 ; j < repDataSets[i].length ; j ++){
            repDataSets[i][j].r = repDataSets[i].length * 3; 
        }
    }
}
//-----------------------------------------------------------------------------
function createWeightRepsObjects(weightAtReps, prDataSet, liftName){
    for (let i = 0; i < prDataSet.length ; i ++ ){
        if (!weightAtReps[prDataSet[i].weight]){ 
            weightAtReps[prDataSet[i].weight] = [
                {   x:prDataSet[i].weight,y:prDataSet[i].reps, 
                    date: formatBackendDateData(prDataSet[i].date), 
                    name: liftName  }];
        } else { 
            weightAtReps[prDataSet[i].weight].push(
                {   x:prDataSet[i].weight,
                    y:prDataSet[i].reps, 
                    date: formatBackendDateData(prDataSet[i].date), 
                    name: liftName  });
        }
    }   
   
}
//-----------------------------------------------------------------------------
function createChartJSdatasetObject(weightLabels, repDataSets, color){
    const datasetObj = repDataSets.map((points, idx) => ({
        label: weightLabels[idx],
        data: points,
        backgroundColor: color,
        borderColor: color
    }))
    return datasetObj;
}
//-----------------------------------------------------------------------------