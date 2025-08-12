import { accessLevelValid, endpoint as c, DoW, months } from "../config.js";
import { currLifter, f } from "../lifterSidebar.js";
import { loadMonthlyCharts } from "./monthlyChartDash.js";
import { createCursor } from "../cursor.js";
import { createrWorkoutHeader, getWorkoutFromWokroutID } from "./workoutDash.js";
import { loggedinLifter } from "../login.js";

export let curYear;
export let curMonth;
export let curlastDay;

let daySelected = {};

const calendarBoxes  = 42;
const datesThisMonth = [];          // will hold date objects for the cur month
const datesPrevMonth = [];         // will hold date objects for the prev month
const datesNextMonth = [];         // will hold date objects for the next month

let days = [];
let workouts = [];

//-----------------------------------------------------------------------------
// method to retrieve the information to populate calendar with days 
//-----------------------------------------------------------------------------
function getMonthlyWorkouts(userId, curDate){
    workouts.length = 0;
    // get all 42  days for the current calendar box
    const days = [...document.querySelectorAll(".day")];
    // base from which we will get prev, cur, and next month training info
    const curMonth = Number(curDate.month);
    // adjust if at boundaries of year
    const prevmonth = curMonth - 1 < 0 ? 11 : curMonth - 1;
    const nextmonth = curMonth + 1 > 11 ? 0 : curMonth + 1;
    // make arrays of the days on calendar that fall into prev,cur,next month
    const daysPrevM = days.filter(day=>Number(day.dataset.month)===prevmonth);
    const daysThisM = days.filter(day=>Number(day.dataset.month)===Number(curDate.month));
    const daysNextM = days.filter(day=>Number(day.dataset.month)===nextmonth);
    // make new date objects so we can query the DB about these dates
    const nextDate = new Date(curDate.year, curDate.month+1);
    const prevDate = new Date(curDate.year, curDate.month-1);
    const prev = {"month" : prevDate.getMonth(), "year" : prevDate.getFullYear()};
    const next = {"month" : nextDate.getMonth(), "year" : nextDate.getFullYear()};
    // begin queries 
    f.post(c.GET_MONTHLY_LIFTS, {userId, curDate}).then(lifts=>{
        lifts.forEach(lift=>{
            fillMiniWorkoutMap(daysThisM, lift);
            });
    });
    f.post(c.GET_MONTHLY_LIFTS, {userId, "curDate" : prev}).then(lifts=>{
        lifts.forEach(lift=>{
            fillMiniWorkoutMap(daysPrevM, lift);
        });
    });
    f.post(c.GET_MONTHLY_LIFTS, {userId, "curDate" : next}).then(lifts=>{
        lifts.forEach(lift=>{
            fillMiniWorkoutMap(daysNextM, lift);
        });
    });
}
//-----------------------------------------------------------------------------
// method to populate calendar with days where trianing occurred and if SBD
//-----------------------------------------------------------------------------
function fillMiniWorkoutMap(daysThisMonth, lift){
    // flags to make sure we just apply the styling once on the calenar
    let liftDayPresent = false;
    // get the calendar day that matches the training day
    let curday = daysThisMonth[0];

    for (let i = 0 ; i < daysThisMonth.length ; i ++){
        if (Number(daysThisMonth[i].dataset.day) === Number(lift.day)){
            curday = daysThisMonth[i];
            liftDayPresent = true;
            break;
        }
    }
    // dont put anything if no workouts present for displayed days
    if (!liftDayPresent) return; 
    // add some more data 
    curday.dataset.idWorkout = lift.idWorkout;
    curday.classList.add("dayLifted");
    // squat bench deadlift performed this day ?
    const liftPerformed = lift.ExerciseCategory;
    
    if (liftPerformed === "squat"){
        const squatBox = document.createElement('div');
        if (curday.querySelectorAll('.squatDay').length === 0){
            squatBox.classList.add('squatDay');
            curday.append(squatBox);
        }
    }
    if (liftPerformed === "deadlift"){
        const deadBox = document.createElement('div');
        if (curday.querySelectorAll('.deadDay').length === 0){
            deadBox.classList.add('deadDay');
            curday.append(deadBox);
        }
    }
    if (liftPerformed === "bench"){
        const benchBox = document.createElement('div');
        if (curday.querySelectorAll('.benchDay').length === 0){
            benchBox.classList.add('benchDay');
            curday.append(benchBox);
        }
    }
    if (liftPerformed === "accessory"){
        const otherLift = document.createElement('div');
        if (curday.querySelectorAll('.otherLiftDay').length === 0){
            otherLift.classList.add('otherLiftDay');
            curday.append(otherLift);
        }
    }
}
//-----------------------------------------------------------------------------
// method to fill the calendar with the correct days
//-----------------------------------------------------------------------------
export function fillCalendar(year, month, lastday){                               
    clearCalendar();
    curYear = year;
    curMonth = month;
    curlastDay = lastday;
    //-------------------------------------------------------------------------
    createAllDateObjects(year, month, lastday);
    //-------------------------------------------------------------------------
    days = [...document.querySelectorAll(".day")];  // 42 html boxes for curMon
    const firstDay = datesThisMonth[0].getDay(); // determine day of week start 
    //-------------------------------------------------------------------------   
    // filling the boxes
    //-------------------------------------------------------------------------                                                     
    let idx     = 0;                       // pointer for the date-object array
    let nextidx = 0;                    // pointer for next month date-obj arry
    let weekidx = 1;
    let firstindex = firstDay;
    let done = false;
    for (let i = 0 ; i < calendarBoxes ; i ++ ){     // fill out the html boxes
        if(Math.floor((i)/7)===0) {// add the days of the week on the first row
            addNamesOfDays(days, i);
        } 
        if(i%7===0) {                       // week number on the start of rows
            addWeekNumbers(days, i, weekidx);
            weekidx ++ ;
        } 
        if (i >= firstDay){   // can start filling dates on first day of curMon

            if (idx >= datesThisMonth.length){     // if beyond cur month's day
                fillNextMonth(days, i, nextidx);
                if (days[i].id.includes("sun")) {
                    done = true; // if at sunday after finishing current month,
                }                                  //  hide the remaining boxes
                if (done) {                            // hide from here on out
                    days[i].style.display = "none";
                }
                nextidx ++ ;
                continue;
            };

            fillCurrentMonth(days, i, idx);
            idx ++ ;
            if (    i-1  === getToday().day           // highlight today's date
                && year  === getToday().year 
                && month === getToday().month){
                    days[i].classList.add("today");
                }
        } else {   // if before start cur month, fill in with end of prev month
            fillPrevMonth(days, i, firstindex);
            firstindex -- ;
        }
    }
    getMonthlyWorkouts(currLifter.id, {month, year});
    loadMonthlyCharts(currLifter.id, curMonth, curYear);
    checkForSelectedDay();
    addMonthAndYear(curMonth, curYear);
}
//-----------------------------------------------------------------------------
// create an event listener for the calendar when a day is clicked
// this approach remove need for adding/removing day listeners manually
//-----------------------------------------------------------------------------
export function dayEventListener(){     //have main container listen for events
    const calendar = document.querySelector(".month");
    calendar.addEventListener("click", dayListener);
}
async function dayListener(e){
    if (e.target.classList.contains("day")){ 
        dayClickEvent();
    }
    if (e.target.id === "backMonth"){
        backMonth();
    }
    if (e.target.id === "forwardMonth"){
        forwardMonth();
    }
}
//-----------------------------------------------------------------------------
function backMonth(){
    clearCalendar();
    changeDateDown(curYear,curMonth);
    days.forEach(day=>day.classList.remove("daySelected"));
    document.querySelector(".addExerciseDash")?.classList.remove("addExerciseDashVisible"); 
}
//-----------------------------------------------------------------------------
function forwardMonth(){
    clearCalendar();
    changeDateUp(curYear,curMonth);
    days.forEach(day=>day.classList.remove("daySelected"));
    document.querySelector(".addExerciseDash")?.classList.remove("addExerciseDashVisible"); 
}
//-----------------------------------------------------------------------------
async function dayClickEvent(){
    const workoutArea = document.querySelector(".workout");
    workoutArea.innerHTML =``;                       // clear previous data
    const days = document.querySelectorAll(".day");
    days.forEach(day=>day.classList.remove("daySelected"));
    e.target.classList.add("daySelected");
    daySelected = {"day" : e.target.dataset.day, "month" : e.target.dataset.month};
    const dateInfo = JSON.parse(e.target.dataset.info);          //get info
    if (e.target.dataset.idWorkout) {
        createrWorkoutHeader(dateInfo);
        getWorkoutFromWokroutID(e.target.dataset.idWorkout);
    } else {
        // prevent outsider from adding workout 
        if (!await accessLevelValid()){
            const workoutContainer = document.querySelector(".workout");
            workoutContainer.style.display = "none";
            return; 
        } 
        // otherwise add new workout for authorized user
        createrWorkoutHeader(dateInfo);
        createCursor(workoutArea);      // setup for starting a new workout
    }
    workoutArea.classList.toggle('visible');
}
//-----------------------------------------------------------------------------
// arrow key event listeners for changing calendar dates
//-----------------------------------------------------------------------------
export function calendarListener(){
    document.addEventListener("keydown", (event)=>{ //keydowna n
        const calendar = document.querySelector(".month");
        if (getComputedStyle(calendar).visibility === "hidden") return;
        switch (event.key){
            case 'ArrowRight': 
                forwardMonth();
                break;
            case 'ArrowLeft': 
                backMonth();
                break;
            default:
                return;
        }
        event.preventDefault();
    });
}
//-----------------------------------------------------------------------------
// helper methods for filling out the calendar
//-----------------------------------------------------------------------------
function addMonthAndYear(month, year){
    const calendar =  document.querySelector(".month");
    calendar.insertAdjacentHTML("afterbegin",
        `<div class="dateWrapper">
            <div class="monthTitle">${months[month]}</div> 
            <div class="yearTitle">${year}</div>
            <div id="backMonth">➞</div>
            <div id="forwardMonth">➞</div>
        </div>`);
}
function removeMonthAndYear(){
    document.querySelector(".dateWrapper")?.remove();
}
//-----------------------------------------------------------------------------
function addNamesOfDays(days, i){
    days[i].insertAdjacentHTML("beforeend", 
        `<div class="dayName">${DoW[i]}</div>`);
}
//-----------------------------------------------------------------------------
function addWeekNumbers(days, i, weekidx){
    days[i].insertAdjacentHTML( 
        "beforeend", 
        `<div class="weekNumber">week ${weekidx++}</div>`);
}
//-----------------------------------------------------------------------------
function fillCurrentMonth(days, i, idx){
    days[i].dataset.info = createDateObject(datesThisMonth[idx], 
        datesThisMonth[datesThisMonth.length-1]);  // phase this out eventually

    days[i].dataset.day       = datesThisMonth[idx].getDate();
    days[i].dataset.dow       = datesThisMonth[idx].getDay();
    days[i].dataset.month     = datesThisMonth[idx].getMonth();
    days[i].dataset.monthName = months[datesThisMonth[idx].getMonth()];
    days[i].dataset.year      = datesThisMonth[idx].getFullYear();
    days[i].dataset.lastDay   = datesThisMonth[datesThisMonth.length-1].getDate(),
    days[i].dataset.lifterID  = currLifter.id

    days[i].insertAdjacentHTML("beforeend",
        `<div class="dayNum">
            ${datesThisMonth[idx].getDate()}
        </div>`);
}
//-----------------------------------------------------------------------------
function fillPrevMonth(days, i, idx){
    days[i].dataset.info = createDateObject(datesPrevMonth.at(-idx), 
    datesPrevMonth.at(datesPrevMonth.length-1));
     
    days[i].dataset.day       = datesPrevMonth.at(-idx)?.getDate();
    days[i].dataset.dow       = datesPrevMonth.at(-idx)?.getDay();
    days[i].dataset.month     = datesPrevMonth.at(-idx)?.getMonth();
    days[i].dataset.monthName = months[datesPrevMonth.at(-idx)?.getMonth()];
    days[i].dataset.year      = datesPrevMonth.at(-idx)?.getFullYear();
    days[i].dataset.lifterID  = currLifter.id

    days[i].insertAdjacentHTML("beforeend",                  // start nxt month
    `<div class="dayNum">
        ${datesPrevMonth.at(-idx)?.getDate()}
    </div>`);  
    days[i].classList.add("unfocusedDate");                   // dim these days
}
//-----------------------------------------------------------------------------
function fillNextMonth(days,i, idx){
    days[i].dataset.info = createDateObject(datesNextMonth[idx], 
        datesNextMonth[datesNextMonth.length-1]);

    days[i].dataset.day       = datesNextMonth[idx].getDate();
    days[i].dataset.dow       = datesNextMonth[idx].getDay();
    days[i].dataset.month     = datesNextMonth[idx].getMonth();
    days[i].dataset.monthName = months[datesNextMonth[idx].getMonth()];
    days[i].dataset.year      = datesNextMonth[idx].getFullYear();
    days[i].dataset.lastDay   = datesNextMonth[datesNextMonth.length-1].getDate(),
    days[i].dataset.lifterID  = currLifter.id
    
    days[i].insertAdjacentHTML("beforeend",
        `<div class="dayNum">
        ${datesNextMonth[idx].getDate()}
        </div>`);
    days[i].classList.add("unfocusedDate");
}
//-----------------------------------------------------------------------------
// create all the date objects for the current calendar display
//-----------------------------------------------------------------------------
function createAllDateObjects(year, month, lastday){
    const prevDate = new Date(year, month-1); 
    const prevMonth = prevDate.getMonth();
    const lastdayPrevMonth = new Date(year, prevMonth + 1, 0).getDate(); 

    const nextDate = new Date(year, month+1); 
    const nextMonth = nextDate.getMonth();
    const lastDaynextMonth = new Date(year, nextMonth + 1, 0).getDate();
    
    //-------------------------------------------------------------------------
    for (let i = 1 ; i <= lastdayPrevMonth ; i ++ ){   // date objs for pre mon
        datesPrevMonth.push(new Date(year, prevMonth, i));
    }
    //-------------------------------------------------------------------------
    for (let i = 1 ; i <= lastday ; i ++ ){  // create date objects for cur mon
        datesThisMonth.push(new Date(year, month, i));
    }
    //-------------------------------------------------------------------------
    for (let i = 1 ; i <= lastDaynextMonth ; i ++ ){  // date objs for next mon
        datesNextMonth.push(new Date(year, nextMonth, i));
    }
}
//-----------------------------------------------------------------------------
// method for changing the date on the calendar forward one month
//-----------------------------------------------------------------------------
export function changeDateUp(year, month){
	month ++ ;
	if (month > 11) {
		year ++;
		month = 0;
	}
	const lday = new Date(year, month + 1, 0).getDate(); 
    fillCalendar(year,month, lday)
}
//-----------------------------------------------------------------------------
// method for changing the date on the calendar back one month
//-----------------------------------------------------------------------------
export function changeDateDown(year, month){
	month -- ;
	if (month < 0) {
		year -- ;
		month = 11;
	}
	const lday = new Date(year, month + 1, 0).getDate(); 
    fillCalendar(year,month, lday)
}
//-----------------------------------------------------------------------------
// clears calendar html when switching dates
//-----------------------------------------------------------------------------
export function clearCalendar(){
    datesNextMonth.length = 0;
    datesThisMonth.length = 0;
    datesPrevMonth.length = 0;
    days.forEach(day=>{
        day.innerHTML = '';
        day.classList.remove('unfocusedDate', 'today', 'dayLifted', 'daySelected', 'prDateHighlighted');
        day.style.visibility = "visible";
        day.style.display = "flex";
        Object.keys(day.dataset).forEach(key => delete day.dataset[key]);
        // since not recreating the html for the calendar need to go through and
                                // clear all the data in the days for each month
    });
    days.length = 0;
    removeMonthAndYear();
}
//-----------------------------------------------------------------------------
// create an object to store in a day's data-set html
//-----------------------------------------------------------------------------
function createDateObject(date, lastday){
    return JSON.stringify({
        dow: DoW[date.getDay()], 
        day: date.getDate(), 
        month: months[date.getMonth()],
        monthNumber : date.getMonth(), 
        year:date.getFullYear(),
        lastDay: lastday.getDate(),
        lifterID: currLifter.id
    });
}   
//-----------------------------------------------------------------------------
// get today's date
//-----------------------------------------------------------------------------
export function getToday(){
    const d = new Date();
    return {day: d.getDate(), month: d.getMonth(), year: d.getFullYear()};
}
//-----------------------------------------------------------------------------
// method to keep the selected date highlighted after switching calendars
//-----------------------------------------------------------------------------
function checkForSelectedDay(){
    days.forEach(day=>{;
        if (day.dataset.day   === daySelected.day && 
            day.dataset.month === daySelected.month){
            setTimeout(() => {                                // force a redraw
                day.classList.add('daySelected');
            }, 10);
        }
    })
}