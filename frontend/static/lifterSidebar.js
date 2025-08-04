import Lifter from "./lifter.js";
import { endpoint as c, year, month, lastday } from "./config.js";
import fetchWrapper from "./fetchWrapper.js";
import { fillCalendar } from "./dashboards/calendarDash.js";
import { createPrDash } from "./dashboards/prDash.js";
import { loggedinLifter } from "./login.js";
import { Ifollow } from "./follow.js";
import { lifterDashHeaderContent } from "./htmlTemplates.js";

export const f = new fetchWrapper(c.API_URL);  // this should prob be in config

export const LIFTERS = [];               // list to hold all the lifter objects
export let currLifter = {};        // track current lifter selected by the user


//-----------------------------------------------------------------------------
// This method basically controls the starting point for the whole app
//-----------------------------------------------------------------------------
export function loadLifter(e){
    if (e && ! e.target.classList.contains("lifterName")) return ;
    setCurrLifterFromEvent(e);  
    setConfigPermission();
    resetAndFillDashes();
    setFollowIcon();
}
//-----------------------------------------------------------------------------
// This method fetches all the lifters and their info from the databse
//-----------------------------------------------------------------------------
export function getLiftersIfollow(){
    f.post(c.LIFTERS_I_FOLLOW, {"idLifter" : loggedinLifter.id})
    .then(lifters=>{
        LIFTERS.length = 0;
        fillLifters(lifters);   // create lifter objects from lifters in the db
        fillMenu()                     // fill out the menu with active lifters
    })
    .catch(rejection=>{
        console.error(rejection);
    });
} 
//-----------------------------------------------------------------------------
// fills the div id= "main menu" with names from each User object created
//-----------------------------------------------------------------------------
export function fillMenu(){
    if (LIFTERS.length === 0) return;
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
                ${lifter.userName.charAt(0).toUpperCase() + lifter.userName.slice(1)}
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
    sidebar.addEventListener("click", loadLifter);
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
//------------------------------------------------------------------------------
// load lifter helpers 
//------------------------------------------------------------------------------
export async function setFollowIcon(){   // this is realy reset the whole header
    if (currLifter.id === loggedinLifter.id) return;
    // reset main dash header
    const lifterBoxHeader = document.querySelector('.lifterBoxHeader');
    lifterBoxHeader.innerHTML = lifterDashHeaderContent;
    const lifterHeaderName = document.getElementById("lifterHeaderName");
    lifterHeaderName.innerHTML = currLifter.userName;//reset name it gets erased
    // follow icon logic 
    const idoFollow = await Ifollow(loggedinLifter.id, currLifter.id);
    if (idoFollow){ 
        lifterBoxHeader.insertAdjacentHTML("beforeend", 
            `<div id="followIconWrapper">
                <div id="followText">following</div>
                <div id="followIcon">↻</div>
            </div>`)
    } else {
        lifterBoxHeader.insertAdjacentHTML("beforeend", 
        `<div id="followIconWrapper">
            <div id="followText">follow</div>
            <div id="followIcon">⋙</div>
        </div>`)
    }
}
//------------------------------------------------------------------------------
function setCurrLifterFromEvent(e){
    let cLifter = null;
    let info = null;                          
    if (e) {                                  // if a name click event, do this
        info = JSON.parse(e.target.dataset.lifter);
        cLifter = getLifterObject(info.id);   
    } else {
        cLifter = loggedinLifter;         // otherwise lifter loaded from login
    }
    currLifter = cLifter;         // make sure currlifter is of obj type Lifter 
}
//------------------------------------------------------------------------------
function setConfigPermission(){
    const config = document.getElementById("lifterConfig");
    if (currLifter.id !== loggedinLifter.id){ // check to make sure config only
        config.style.visibility = "hidden";            // available to its user
    } else {
        config.style.visibility = "visible";
    }
}
//------------------------------------------------------------------------------
function resetAndFillDashes(){
    const calendar = document.querySelector(".month");
    const workout = document.querySelector(".workout");
    const addExerciseDash = document.querySelector(".addExerciseDash");
    const lifterHeaderName = document.getElementById("lifterHeaderName");
    lifterHeaderName.innerHTML = currLifter.userName;
    calendar.style.display = "flex"
    workout.style.display = "none";
    workout.innerHTML = '';                        
    addExerciseDash?.classList.remove("addExerciseDashVisible"); 
    fillCalendar(year,month,lastday);    // get this lifter's training sessions
    createPrDash(currLifter.prDashSelection, currLifter.id);  
    setTimeout(()=>{document.getElementById('headerTitle')
        .scrollIntoView({"behavior" : "smooth"})}, 200);
}
//-----------------------------------------------------------------------------
export function clearLifters(){
    const activeLifters = document.querySelector('.activeLifterNamesWrapper');
    activeLifters?.parentElement.removeChild(activeLifters);
}
//-----------------------------------------------------------------------------
