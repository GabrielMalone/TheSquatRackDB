import { clearNewLifterFields } from "./newLifterSideBar.js";
import { lifterSidebarSearch } from "./htmlTemplates.js";
import { logoutEvent, login } from "./login.js";
import { findLifter } from "./searchLifter.js";
import { getLiftersIfollow, loadLifter } from "./lifterSidebar.js";
import { getMyAthletes } from "./coach.js";

let myAthletesLoaded = false;
let liftersIfollowLoaded = false;

//-----------------------------------------------------------------------------
// event listeners and actions for the buttons in the main header
//-----------------------------------------------------------------------------
export function headerListeners(){
    const body = document.querySelector('.container');
    body.addEventListener("click", headerListenerEvents)
    login("stella", "stellathecat");    // for dev purposes / quick admin login
}
function headerListenerEvents(e){
    if (e.target.id === "activeLifters"){
        activeLiftersClickEvent();
    }
    if (e.target.id === "addLifter" || e.target.id === "newLifterX"){
        addLifterEvent();
         //close login if open 
        const loginBox = document.querySelector('.loginBoxWrapper');
        if (!loginBox.classList.contains('hidden')){
            loginBox.classList.add('hidden');
        }
    }
    if (e.target.id === "login" || e.target.id === "loginX"){
        loginClickEvent();
        //close new user if open 
        const newUserWindow = document.querySelector('.newLifterWrapper');
        if (newUserWindow.classList.contains('visible')){
            newUserWindow.classList.remove('visible');
        }
    }
    if (e.target.id === "logout"){
        logoutEvent();
    }
    if (e.target.id === "homeButton"){
        goHome();
    }
    if (e.target.id === "myAthletes"){
        console.log("my athletes clicked");
        myAthletesClickEvent();
    }
}
//-----------------------------------------------------------------------------

function addLifterEvent(){
    const addLifterBox = document.querySelector(".newLifterWrapper");
    clearNewLifterFields();
    addLifterBox.classList.add("visible"); // Toggle a class
}
//-----------------------------------------------------------------------------

function myAthletesClickEvent(){
    const sidebar = document.getElementById("lifterMenu");     // build sidebar 
    sidebar.innerHTML = ``;                        // clear any previous builds  
    sidebar.insertAdjacentHTML("beforeend", 
    `<div class="lifterSidebarDashWrapper"></div>`);
    if (!myAthletesLoaded){
        sidebar.classList.add("visible");
        sidebar.classList.add('myAthletes')
        myAthletesLoaded     = true;
        liftersIfollowLoaded = false;
        getMyAthletes();
    } else {
        sidebar.classList.toggle('visible');
        sidebar.classList.toggle('myAthletes');
        getMyAthletes();
    }
}
//-----------------------------------------------------------------------------

function activeLiftersClickEvent(){
    const sidebar = document.getElementById("lifterMenu");     // build sidebar 
    sidebar.innerHTML = ``;                        // clear any previous builds
    sidebar.insertAdjacentHTML("afterbegin", lifterSidebarSearch);//sidebarhtml
    getLiftersIfollow();                 
    const searchBar = document.querySelector('.findLifterInput'); 
    if (!liftersIfollowLoaded){
        sidebar.classList.add("visible");
        sidebar.classList.add('liftersIfollow')
        liftersIfollowLoaded = true;    
        myAthletesLoaded     = false;    
    } else {
        sidebar.classList.toggle('visible');
        sidebar.classList.toggle('liftersIfollow');        
    }
    searchBar.addEventListener("input", findLifter); //listen for search inputs
}
//-----------------------------------------------------------------------------

function loginClickEvent(){
    const loginBox = document.querySelector('.loginBoxWrapper');
    loginBox.classList.remove('hidden');
}

//-----------------------------------------------------------------------------
function goHome(){
    loadLifter();
}