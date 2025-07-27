import { f , getLifterObject, setCurrlifter, currLifter} from "./lifterSidebar.js";
import { endpoint as end, year, month, lastday } from "./config.js";
import { fillCalendar } from "./dashboards/calendarDash.js";
import { createPrDash } from "./dashboards/prDash.js";

const loginBox = document.querySelector('.loginBoxWrapper');

//-----------------------------------------------------------------------------
// event for clicking on login. 
//-----------------------------------------------------------------------------
export function loginClick(){
    const loginForm = document.querySelector(".loginBox");
    loginForm.addEventListener("submit", loginEvent);
}
//-----------------------------------------------------------------------------
// user clicks on login button
//-----------------------------------------------------------------------------
function loginEvent(e){
    e.preventDefault();
    const userName = document.getElementById('loginUserName').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    login(userName, password);
}
//-----------------------------------------------------------------------------
export function login(userName, password){
   f.post(end.LOGIN, {userName, password}) // verify pw with hashpw on backend
    .then(res=>{
        if (res.message === "success") {
            toggleLoginCreateBoxVisibility();
            f.post(end.GET_LIFTER_BY_USER_NAME, userName)
            .then(data=>{
                const idUser = data['idUser'];
                loadLifterFromLogin(userName, idUser)
            })
            .catch(err=>console.error(err));
        } else {
            console.log("incorrect password");
            // otherwise give error in the error box
        }
    })
    .catch(err=>console.error(err)); 
}
//-----------------------------------------------------------------------------
function loadLifterFromLogin(userName, id){

    const lifterHeaderName = document.getElementById("lifterHeaderName");
    const config = document.getElementById("lifterConfig");
    const calendar = document.querySelector(".month");
    const workout = document.querySelector(".workout");
    const addExerciseDash = document.querySelector(".addExerciseDash");
    const info = {userName, id}
    // set current lifter
    setCurrlifter(info);
    // reset the various dashes / dash elements
    lifterHeaderName.innerHTML  = `${userName}`;
    config.style.visibility     = "visible";
    calendar.style.display      = "flex"
    workout.innerHTML           = '';                                 
    addExerciseDash?.classList.remove("addExerciseDashVisible"); 

    fillCalendar(year,month,lastday);    // get this lifter's training sessions
    const cLifter = getLifterObject(currLifter.id); // holds array pr selection
    createPrDash(cLifter.prDashSelection, cLifter.id);    
}
//-----------------------------------------------------------------------------
// toggle the visibility of the create/login boxes at appropriate times
//-----------------------------------------------------------------------------
function toggleLoginCreateBoxVisibility(){
    if (loginBox.classList.contains('visible')){
        loginBox.classList.toggle('visible');
    }
    const createLifterBox = document.querySelector(".newLifterWrapper")
    if (createLifterBox.classList.contains('visible')){
        createLifterBox.toggle("visible");
    }
}