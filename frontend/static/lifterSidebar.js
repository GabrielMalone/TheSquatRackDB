import Lifter from "./lifter.js";
import { endpoint as c, year, month, lastday } from "./config.js";
import fetchWrapper from "./fetchWrapper.js";
import {fillCalendar } from "./dashboards/calendarDash.js";
import { createPrDash } from "./dashboards/prDash.js";
import { loggedInUserID, loginLogout } from "./login.js";

export const f = new fetchWrapper(c.API_URL);  // this should prob be in config

export const LIFTERS = [];               // list to hold all the lifter objects
export let currLifter = {};        // track current lifter selected by the user


//-----------------------------------------------------------------------------
// This method basically controls the starting point for the whole app
//-----------------------------------------------------------------------------
function clickLifterNameEvent(e){

    if (! e.target.classList.contains("lifterName")) return ;

    const lifterHeaderName = document.getElementById("lifterHeaderName");
    const config = document.getElementById("lifterConfig");
    const calendar = document.querySelector(".month");
    const workout = document.querySelector(".workout");
    const addExerciseDash = document.querySelector(".addExerciseDash");
    const info = JSON.parse(e.target.dataset.lifter);
    // set current lifter
    const cLifter = getLifterObject(info.id);     // holds array pr selection
    currLifter = cLifter;       // make sure currlifter is of obj type Lifter
    // reset the various dashes / dash elements
    lifterHeaderName.innerHTML  = `${info.userName}`;
    if (currLifter.id !== loggedInUserID){
        config.style.visibility = "hidden";
    } else {
        config.style.visibility = "visible";
    }
    calendar.style.display = "flex"
    workout.innerHTML = '';                                 
    addExerciseDash?.classList.remove("addExerciseDashVisible"); 
    fillCalendar(year,month,lastday);    // get this lifter's training sessions
    createPrDash(cLifter.prDashSelection, cLifter.id);  
    setTimeout(()=>{document.getElementById('headerTitle')
        .scrollIntoView({"behavior" : "smooth"})}, 200);
}
//-----------------------------------------------------------------------------
// This method fetches all the lifters and their info from the databse
//-----------------------------------------------------------------------------
export const getLifters = () => {
    f.get(c.LIFTERS_ENDPOINT)
    .then(lifters=>{
        LIFTERS.length = 0;
        fillLifters(lifters);   // create lifter objects from lifters in the db
        fillMenu()                     // fill out the menu with active lifters
        getLifterListeners();
        const activeLifters = document.querySelector('.activeLifterNamesWrapper');
        activeLifters.innerHTML = ``;
    })
    .catch(rejection=>{
        console.error(rejection);
    });
} 
//-----------------------------------------------------------------------------
// fills the div id= "main menu" with names from each User object created
//-----------------------------------------------------------------------------
export function fillMenu(){
    const menu = document.getElementById("lifterMenu");
    // insert search menu at top of sidebar
    const menuDashWrapper = menu.querySelector('.lifterSidebarDashWrapper');
    // then fill names of active lifters below
    const activeLifters = document.querySelector('.activeLifterNamesWrapper');
    if (activeLifters){
        activeLifters.parentElement.removeChild(activeLifters);
    }
    menuDashWrapper.insertAdjacentHTML("beforeend",
        `<div class="activeLifterNamesWrapper">
            <ul>
                ${LIFTERS.map(lifter=>
                `<li class="lifterName" 
                id="${lifter.userName}"
                data-lifter='${JSON.stringify({userName:lifter.userName, id:lifter.id})}'>
                ${lifter.userName}
                </li>`)
                .sort()
                .join("")}
            </ul>
        </div>`);
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
//------------------------------------------------------------------------------
// the action for clicking on a lifter's config button
// for now this just deletes the user
//------------------------------------------------------------------------------
export const configEventListener = () => {
    const config = document.getElementById("lifterConfig");
    if (currLifter.id !== loggedInUserID) {
        return;
    }
    config.addEventListener("click", configClickEvent);
}
function configClickEvent(){
    loginLogout("out");    
    const createLifterButon = document.getElementById('addLifter')
    const partnerList       = document.querySelector('.sidebar');
    const loginBox      = document.querySelector('.loginBoxWrapper');  
    const calendar      = document.querySelector(".month");
    const lifterName    = document.getElementById("lifterHeaderName");
    const config        = document.getElementById("lifterConfig");
    const workoutDash   = document.querySelector(".workout");
    const dateWrapper   = document.querySelector(".dateWrapper");
    const prDash        = document.querySelector(".prDash");
    const prDashHeader  = document.querySelector("#prDashHeader");
    const monthlyChartDashWrapper = document.querySelector('.monthlyChartDashWrapper');
    const cursorForPRDash = document.getElementById('cursorForprDashBoard');
    const dashHeaders       = document.querySelectorAll('.dashHeader');
    loginBox.classList.remove('hidden');
    createLifterButon.classList.remove('hidden');
    dashHeaders.forEach(header=>header.parentNode.removeChild(header));
    if (activeLifters.classList.contains('visible')){
        activeLifters.classList.remove('visible');
    }
    f.delete(c.LIFTERS_ENDPOINT, currLifter.id)    // logic to delete currlifter
    .then(()=>{
        LIFTERS.length = 0;
        getLifters();
        currLifter = {};
        partnerList.innerHTML = ``;
        partnerList.classList.remove('visible');
        lifterName.innerHTML      = ``; // clear out the main lifter window
        config.style.visibility   = "hidden";
        calendar.style.display    = "none";
        workoutDash.style.display = "none";
        dateWrapper.style.display = "none";
        monthlyChartDashWrapper.innerHTML = ``;
        prDash.innerHTML = ``;
        prDashHeader.innerHTML = ''
        cursorForPRDash.parentNode?.removeChild(cursorForPRDash);
    })
    .catch(err=>console.error(err));
}
//------------------------------------------------------------------------------
// get the lifter class object for a spcific lifter via id
//------------------------------------------------------------------------------
export function getLifterObject(lifterID){
    for (const lifter of LIFTERS){
        if (parseInt(lifter.id) === parseInt(lifterID)){
            return lifter;
        }
    }
}
//------------------------------------------------------------------------------
export function setCurrlifter(lifter) {
  currLifter = lifter;
}