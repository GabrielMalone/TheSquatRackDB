import { clearNewLifterFields } from "./newLifterSideBar.js";

//-----------------------------------------------------------------------------
// event listeners and actions for the buttons in the main header
//-----------------------------------------------------------------------------
export function headerListeners(){
    const body = document.querySelector('.container');
    body.addEventListener("click", headerListenerEvents)
}
function headerListenerEvents(e){
    if (e.target.id === "activeLifters"){
        activeLiftersClickEvent();
    }
    if (e.target.id === "addLifter" || e.target.id === "newLifterX"){
        addLifterEvent();
         //close login if open 
        const loginBox = document.querySelector('.loginBoxWrapper');
        if (loginBox.classList.contains('visible')){
            loginBox.classList.remove('visible');
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
}
//-----------------------------------------------------------------------------

function addLifterEvent(){
    const addLifterBox = document.querySelector(".newLifterWrapper");
    clearNewLifterFields();
    addLifterBox.classList.toggle("visible"); // Toggle a class
}
//-----------------------------------------------------------------------------
function activeLiftersClickEvent(){
    const sidebar = document.querySelector(".sidebar");
    const mainLifterWindow = document.querySelector('.lifterBox');
    sidebar.classList.toggle("visible");
    if (sidebar.classList.contains("visible")){
        mainLifterWindow.style.width = "100%"; 
    } else {
        mainLifterWindow.style.width = "85%";
    }
}
//-----------------------------------------------------------------------------
function loginClickEvent(){
    const loginBox = document.querySelector('.loginBoxWrapper');
    loginBox.classList.toggle('visible');
}
