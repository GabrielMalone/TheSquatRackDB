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
    const mainLifterWindow = document.querySelector('.lifterBox');
    activeLifterButton.addEventListener("click", ()=>{
        sidebar.classList.toggle("visible");
        if (sidebar.classList.contains("visible")){
            mainLifterWindow.style.width = "100%"; 
        } else {
            mainLifterWindow.style.width = "85%";
        }
    });
}