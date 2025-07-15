import { clearNewLifterFields } from "./newLifterSideBar.js";
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
//-----------------------------------------------------------------------------
export function activeLiftersCLick(){
    const activeLifterButton = document.querySelector("#activeLifters");
    const sidebar = document.querySelector(".sidebar");
    activeLifterButton.addEventListener("click", ()=>{
        sidebar.classList.toggle("visible");
    });
}