import Lifter from "./lifter.js";
import { config as c, year, month, lastday } from "./config.js";
import fetchWrapper from "./fetchWrapper.js";
import {fillCalendar } from "./calendar.js";
import { clearCharts } from "./monthlyChart.js";

export const f = new fetchWrapper(c.API_URL);
const LIFTERS = [];                      // list to hold all the lifter objects
export let currLifter = {};        // track current lifter selected by the user

//-----------------------------------------------------------------------------
// event listener for the new lifter submit button
//-----------------------------------------------------------------------------
export const submitNewLifterClick = () => {
    const submitButton = document.querySelector(".createLifterFields");
    submitButton.addEventListener("submit", submitNewLifter);
}
//-----------------------------------------------------------------------------
// This is the logic for clicking the submit new lifter button.
//-----------------------------------------------------------------------------
export const submitNewLifter = (e) => {
    e.preventDefault();
    let userName    = document.getElementById("inputUserName").value.trim();
    const firstName = document.getElementById("inputFirst").value.trim();
    const lastName  = document.getElementById("inputLast").value.trim();
    const email     = document.getElementById("inputEmail").value.trim();
    const errField  = document.getElementById("submitErrorMsg");
    // can do validation stuff here. 
    if (userName.length < 4){
        errField.innerText = "User name must be at leat 4 characters long";
        return;
    }
    userName = userName[0].toUpperCase() + userName.slice(1);
    const newLifter = {
        Email: email || null,
        userFirst: firstName || null,
        userLast: lastName || null,
        userName: userName
    };
    postNewLifter(newLifter);           // if all good send datato the database
}
//-----------------------------------------------------------------------------
// post method to create new lifter in database
//-----------------------------------------------------------------------------
export const postNewLifter = (newLifter) => {
    const errField  = document.getElementById("submitErrorMsg");
    f.post(c.LIFTERS_ENDPOINT, newLifter)
    .then(res=>{
        console.log(res);
        if (res === 200){          // close the newLifter window if done
            document.querySelector(".createLifterBox").classList.toggle("visible");
            LIFTERS.length = 0;
            getLifters();
        }
        if (res === 1062){
            errField.innerText = "username already taken"
        }
    })
    .catch(err=>console.error(err));
}
//-----------------------------------------------------------------------------
// This method fetches all the lifters and their info from the databse
//-----------------------------------------------------------------------------
export const getLifters = () => {
    f.get(c.LIFTERS_ENDPOINT)
    .then(lifters=>{
        fillLifters(lifters);   // create lifter objects from lifters in the db
        fillMenu()                     // fill out the menu with active lifters
        getLifterListeners();
    })
    .catch(rejection=>{
        console.error(rejection);
    });
} 
//-----------------------------------------------------------------------------
// fills the div id= "main menu" with names from each User object created
//-----------------------------------------------------------------------------
export function fillMenu(){
    let menu = document.getElementById("lifterMenu");
    menu.innerHTML =
        `<ul>
        ${LIFTERS.map(lifter=>
        `<li class="lifterName" 
        id="${lifter.userName}"
        data-lifter='${JSON.stringify({userName:lifter.userName, id:lifter.id})}'>
        ${lifter.userName}
        </li>`)
        .sort()
        .join("")}
        </ul>`;
}
//------------------------------------------------------------------------------
// create a LIFTER object from the backend data
//------------------------------------------------------------------------------
export function fillLifters(lifters) {
    lifters.forEach(lifter => LIFTERS.push(new Lifter(lifter)));
}
//------------------------------------------------------------------------------
// the action for clicking on a lifter's name in the sidebar
//------------------------------------------------------------------------------
export function getLifterListeners(){
    const sidebar = document.querySelector(".sidebar");
    sidebar.addEventListener("click", clickLifterNameEvent);
}
function clickLifterNameEvent(e){
    if (! e.target.classList.contains("lifterName")) return ;

    const lifterHeaderName = document.getElementById("lifterHeaderName");
    const config = document.getElementById("lifterConfig");
    const calendar = document.querySelector(".month");
    const workout = document.querySelector(".workout");
    const exerciseMenu = document.querySelector(".addExerciseMenu");
    const info = JSON.parse(e.target.dataset.lifter);
    // clear the various areas
    clearCharts();
    lifterHeaderName.innerHTML  = `${info.userName}`;
    config.style.visibility     = "visible";
    calendar.style.display      = "flex"
    workout.innerHTML           ='';                                 
    currLifter                  = info;
    fillCalendar(year,month,lastday);     // get this lifter's training sessions
}
//------------------------------------------------------------------------------
// the action for clicking on a lifter's config button
//------------------------------------------------------------------------------
export const configEventListener = () => {
    const config = document.getElementById("lifterConfig");
    config.addEventListener("click", configClickEvent);
}
function configClickEvent(){
    const calendar = document.querySelector(".month");
    const lifterName = document.getElementById("lifterHeaderName");
    const config = document.getElementById("lifterConfig");
    const workoutDash =  document.querySelector(".workout");
    const dateWrapper = document.querySelector(".dateWrapper");
    f.delete(c.LIFTERS_ENDPOINT, currLifter.id)  // logic to delete current lifter
    .then(()=>{
        LIFTERS.length = 0;
        getLifters();
        currLifter = {};
        lifterName.innerHTML = ``; // clear out the main lifter window
        config.style.visibility = "hidden";
        calendar.style.display = "none";
        workoutDash.style.display = "none";
        dateWrapper.style.display = "none";
        const monthlyChartDash = document.querySelectorAll(".monthlyChartDash");
        monthlyChartDash.forEach(chart=>chart.innerHTML=``);
    })
    .catch(err=>console.error(err));
}
//------------------------------------------------------------------------------