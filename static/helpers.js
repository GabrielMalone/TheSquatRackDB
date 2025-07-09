import { submitNewLifterClick, configEventListener, getLifters } from "./lifterActions.js";
import { calendarListener, dayEventListener } from "./calendar.js";
import { formUpdateListner, setListener } from "./workout.js";
//-----------------------------------------------------------------------------
// This clears all the input fields for the create new lifter window
//-----------------------------------------------------------------------------
export const clearNewLifterFields = () => {
    document.getElementById("inputUserName").value = "";
    document.getElementById("inputFirst").value = "";
    document.getElementById("inputLast").value = "";
    document.getElementById("inputEmail").value = "";
    document.getElementById("submitErrorMsg").innerText = "";
}
//-----------------------------------------------------------------------------
// event listener for the X close button on the new lifter window
//-----------------------------------------------------------------------------
export const xNewLifterWindow = () => {
    const x = document.querySelector(".X");
    const addLifterBox  = document.querySelector(".createLifterBox");
    x.addEventListener("click", ()=>{
        clearNewLifterFields();
        addLifterBox.classList.toggle("visible"); 
    });
}
//-----------------------------------------------------------------------------
// This is the logic for clicking the addLifter button. makes add window appear
//-----------------------------------------------------------------------------
export const addLifterClick = ()=> {
    const addBUtton     = document.getElementById("addLifter");
    const addLifterBox  = document.querySelector(".createLifterBox");
    addBUtton.addEventListener("click", ()=>{
        clearNewLifterFields();
        addLifterBox.classList.toggle("visible"); // Toggle a class
    });
}
export function activeLiftersCLick(){
    const activeLifterButton = document.querySelector("#activeLifters");
    const sidebar = document.querySelector(".sidebar");
    activeLifterButton.addEventListener("click", ()=>{
        sidebar.classList.toggle("visible");
    });
}
//-----------------------------------------------------------------------------
//                  all the listeners that need to be loaded for the app to work
//-----------------------------------------------------------------------------
export function init(){
    calendarListener();   // event listener for key input for changing months in cal
    activeLiftersCLick(); // event listener for detecting click on lifter in sidebar
    dayEventListener(); // event listener for detecting click on day in the calendar
    setListener();           // event listener for detecting a click on workout sets
    formUpdateListner();                 // event listener for detecting set updates
    configEventListener();    // event listener for config button in the main window
    xNewLifterWindow();                         // x button on the new lifter window
    addLifterClick();                             // add lifter button in the header
    submitNewLifterClick();                 // submit button for new lifter creation
    getLifters();                                  // load lifters from the database
}