import { DoW, months } from "./config.js";
import { currLifter, f } from "./lifterActions.js";
import { createCursor, createrWorkoutHeader, getWorkoutFromWokroutID } from "./workout.js";

export let curYear;
export let curMonth;
export let curlastDay;

const calendarBoxes  = 42;
const datesThisMonth = [];          // will hold date objects for the cur month
const datesPrevMonth = [];         // will hold date objects for the prev month
const datesNextMonth = [];         // will hold date objects for the next month
let days = [];
let workouts = [];

//-----------------------------------------------------------------------------
// method to populate calendar with days where trianing occurred and if SBD
//-----------------------------------------------------------------------------
function getMonthlyWorkouts(userId, curDate){
    workouts.length = 0;
    f.post("monthlyWorkouts", {userId, curDate})
        .then(workouts=>{
            workouts.forEach(workout=>{
                let squat = false;
                let bench = false;
                let dead  = false;
                let other = false;
                // get the calendar day class that matches the training day
                const curday = 
                    document.querySelector(`.day[data-day="${workout.day}"]`);
                curday.dataset.workoutID = workout.idWorkout;
                // squat bench deadlift performed this day ?
                const liftPerformed = workout.ExerciseName;
                if (liftPerformed?.includes("Squat") && !squat){
                    const squatBox = document.createElement('div');
                    squatBox.classList.add('squatDay');
                    curday.prepend(squatBox);
                    squat = true;
                }
                if (liftPerformed?.includes("Dead") && !dead){
                    const deadBox = document.createElement('div');
                    deadBox.classList.add('deadDay');
                    curday.prepend(deadBox);
                    dead = true;
                }
                if (liftPerformed?.includes("Bench") && !bench){
                    const benchBox = document.createElement('div');
                    benchBox.classList.add('benchDay');
                    curday.prepend(benchBox);
                    bench = true;
                }
                if (!squat && !bench && !dead && !other && liftPerformed){
                    const otherLift = document.createElement('div');
                    otherLift.classList.add("otherLiftDay");
                    curday.prepend(otherLift);
                    other = true;
                    return;
                }
            });
        })
        .catch(err=>console.error(err));
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
        if (i === 6){                            // place the name of the month
            addMonthAndYear(days, i, month, year);
        }
        if(Math.floor((i)/7)===0) {// add the days of the week on the first row
            addNamesOfDays(days, i);
        } 
        if(i%7===0) {                       // week number on the start of rows
            addWeekNumbers(days, i, weekidx);
            weekidx ++ ;
        } 
        if (i >= firstDay){   // can start filling dates on first day of curMon

            if (idx >= datesThisMonth.length){     // if beyond cur month's day
                fillPrevMonth(days, i, nextidx);
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
            fillNextMonth(days, i, firstindex);
            firstindex -- ;
        }
    }
    getMonthlyWorkouts(currLifter.id, {month, year});
}
//-----------------------------------------------------------------------------
// create an event listener for the calendar when a day is clicked
// this approach remove need for adding/removing day listeners manually
//-----------------------------------------------------------------------------
export function dayEventListener(){     //have main container listen for events
    const calendar = document.querySelector(".month");
    calendar.addEventListener("click", dayListener);
}
function dayListener(e){
    const workoutArea = document.querySelector(".workout");
    if (e.target.classList.contains("day")){ 
        workoutArea.innerHTML =``;                      // clear previous data
        const days = document.querySelectorAll(".day");
        days.forEach(day=>day.classList.remove("daySelected"));
        e.target.classList.toggle("daySelected");
        const dateInfo = JSON.parse(e.target.dataset.info);         //get info
        if (e.target.dataset.workoutID) {
            createrWorkoutHeader(dateInfo);
            getWorkoutFromWokroutID(e.target.dataset.workoutID);
        } else {
            createrWorkoutHeader(dateInfo);
            createCursor();                 // setup for starting a new workout
        }
    }
}
//-----------------------------------------------------------------------------
// arrow key event listeners for changing calendar dates
//-----------------------------------------------------------------------------
export function calendarListener(){
    document.addEventListener("keydown", (event)=>{
        const calendar = document.querySelector(".month");
        if (getComputedStyle(calendar).visibility === "hidden")return;
        switch (event.key){
            case 'ArrowRight': 
                clearCalendar();
                changeDateUp(curYear,curMonth);
                break;
            case 'ArrowLeft': 
                clearCalendar();
                changeDateDown(curYear,curMonth);
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
function addMonthAndYear(days, i, month, year){
    days[i].insertAdjacentHTML("beforeend",
        `<div class="monthName">
            <p>${months[month]}</p> 
            <p id="year">${year}</p>
        </div>`);
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
        datesThisMonth[datesThisMonth.length-1]);
    days[i].dataset.day = datesThisMonth[idx].getDate();
    days[i].insertAdjacentHTML("beforeend",
        `<div class="dayNum">${datesThisMonth[idx].getDate()}</div>`);
}
//-----------------------------------------------------------------------------
function fillPrevMonth(days, i, nextidx){
    days[i].dataset.info = createDateObject(datesNextMonth[nextidx], 
        datesNextMonth[datesNextMonth.length-1]);
    days[i].dataset.day = datesNextMonth[nextidx].getDate();
    days[i].insertAdjacentHTML("beforeend",                  // start nxt month
    `<div class="dayNum">${datesNextMonth[nextidx].getDate()}</div>`);  
    days[i].classList.add("unfocusedDate");                   // dim these days
}
//-----------------------------------------------------------------------------
function fillNextMonth(days,i, firstindex){
    days[i].dataset.info = createDateObject(datesPrevMonth.at(-firstindex), 
    datesPrevMonth.at(datesPrevMonth.length-1));
    days[i].dataset.day = datesPrevMonth.at(-firstindex)?.getDate();
    days[i].insertAdjacentHTML("beforeend",
        `<div class="dayNum">
        ${datesPrevMonth.at(-firstindex)?.getDate()}
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
        day.classList.remove('unfocusedDate', 'today');
        day.style.visibility = "visible";
        day.style.display = "flex";
        Object.keys(day.dataset).forEach(key => delete day.dataset[key]);
        // since not recreating the html for the calendar need to go through and
                                // clear all the data in the days for each month
    });
    days.length = 0;
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