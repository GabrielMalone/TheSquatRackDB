import { f , setCurrlifter} from "./lifterSidebar.js";
import { endpoint as end, year, month, lastday } from "./config.js";
import { fillCalendar } from "./dashboards/calendarDash.js";
import { createPrDash } from "./dashboards/prDash.js";
import Lifter from "./lifter.js";

const loginBox = document.querySelector('.loginBoxWrapper');
export let loggedinLifter = {};

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
    document.getElementById('loginErrorMsg').innerText = ``; // reset error msg
    f.post(end.LOGIN, {userName, password}) // verify pw with hashpw on backend
        .then(res=>{
            if (res.message === "success") {
                toggleLoginCreateBoxVisibility();
                f.post(end.GET_LIFTER_BY_USER_NAME, userName)
                .then(data=>{
                    loginLogout("in");
                    admin(data); 
                    loadLifterFromLogin(data)
                })
                .catch(err=>console.error(err));
            } else {
                const errField = document.getElementById('loginErrorMsg');
                errField.innerText = "incorrect username or password";
            }
        })
        .catch(err=>{
            console.error(err);
            const errField = document.getElementById('loginErrorMsg');
            errField.innerText = "incorrect username or password";
        }); 
}
//-----------------------------------------------------------------------------
// stuff to do if I log in 
//-----------------------------------------------------------------------------
export function admin(data){
    if (data.isAdmin){
        console.log("admin present");
        const activeLifters = document.getElementById('activeLifters');
        activeLifters.classList.toggle('visible');
    }
}
//-----------------------------------------------------------------------------
// visual changes for login and logout events
//-----------------------------------------------------------------------------
export function loginLogout(state){
    const homeButton = document.getElementById('homeButton');
    const loginButton = document.getElementById("login");
    const logoutButton = document.getElementById("logout");
    if (state === "out"){
        homeButton.classList.remove('visible');
        loginButton.classList.remove('visible');
        logoutButton.classList.remove('visible');
    } else {
        homeButton.classList.add('visible');
        loginButton.classList.add('visible');
        logoutButton.classList.add('visible');
    }
}
//-----------------------------------------------------------------------------
function loadLifterFromLogin(data){

    const lifterHeaderName = document.getElementById("lifterHeaderName");
    const config = document.getElementById("lifterConfig");
    const calendar = document.querySelector(".month");
    const workout = document.querySelector(".workout");
    const addExerciseDash = document.querySelector(".addExerciseDash");
    lifterHeaderName.innerHTML  = `${data.userName}`;
    config.style.visibility     = "visible";
    calendar.style.display      = "flex"
    workout.innerHTML           = '';                                 
    addExerciseDash?.classList.remove("addExerciseDashVisible"); 
    // set current lifter
    const cLifter = new Lifter(data);
    loggedinLifter = cLifter;                // global logged in lifter object
    setCurrlifter(cLifter);
    fillCalendar(year,month,lastday);    // get this lifter's training sessions
    createPrDash(cLifter.prDashSelection, cLifter.id);    
    setTimeout(()=>{    document.getElementById('headerTitle').scrollIntoView({"behavior" : "smooth"});}, 200);
}
//-----------------------------------------------------------------------------
// toggle the visibility of the create/login boxes at appropriate times
//-----------------------------------------------------------------------------
function toggleLoginCreateBoxVisibility(){
    if (!loginBox.classList.contains('hidden')){
        loginBox.classList.add('hidden');
    }
    const createLifterBox = document.querySelector(".newLifterWrapper")
    if (createLifterBox.classList.contains('visible')){
        createLifterBox.remove("visible");
    }
    const createLifterButon = document.getElementById('addLifter');
    createLifterButon.classList.add('hidden');
}
//-----------------------------------------------------------------------------
// what to do when a user logs out. this is same logic as delete minus delete
// need to clear all the various dashes
//-----------------------------------------------------------------------------
export function logoutEvent(){
        loginLogout("out");       // need to actually track login/outon backend
        loginBox.classList.remove('hidden');
        const createLifterButon = document.getElementById('addLifter')
        const sidebar           = document.querySelector('.sidebar');
        const activeLifters     = document.getElementById('activeLifters');
        const calendar          = document.querySelector(".month");
        const lifterName        = document.getElementById("lifterHeaderName");
        const config            = document.getElementById("lifterConfig");
        const workoutDash       = document.querySelector(".workout");
        const dateWrapper       = document.querySelector(".dateWrapper");
        const prDash            = document.querySelector(".prDash");
        const prDashHeader      = document.querySelector("#prDashHeader");
        const monthlyChartDash  = document.querySelector('.monthlyChartDash');
        const cursorForPRDash   = document.getElementById('cursorForprDashBoard');
        const dashHeaders       = document.querySelectorAll('.dashHeader');
        createLifterButon.classList.remove('hidden');
        dashHeaders.forEach(header=>header.parentNode.removeChild(header));
        if (activeLifters.classList.contains('visible')){
            activeLifters.classList.remove('visible');
        }
        setCurrlifter(null);
        lifterName.innerHTML        = ``; 
        config.style.visibility     = "hidden";
        calendar.style.display      = "none";
        workoutDash.style.display   = "none";
        dateWrapper.style.display   = "none";
        monthlyChartDash.innerHTML  = ``;
        prDash.innerHTML            = ``;
        prDashHeader.innerHTML      = '';
        sidebar.classList.remove('visible');
        cursorForPRDash.parentNode?.removeChild(cursorForPRDash);
}