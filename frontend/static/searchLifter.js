import { f, fillLifters, fillMenu, getLifterListeners, LIFTERS } from "./lifterSidebar.js";
import { endpoint as end  } from "./config.js";

//-----------------------------------------------------------------------------
// return results from user keystrokes in lifter search bar 
//-----------------------------------------------------------------------------
export function findLifter(){
    const searchBar = document.querySelector('.findLifterInput'); 
    const userInput = searchBar.value;
    f.post(end.SEARCH_FOR_LIFTER, userInput)
        .then(res=>{
            LIFTERS.length = 0;                            // reset each search
            fillLifters(res);   // create lifter objects from lifters in the db
            fillMenu()                 // fill out the menu with active lifters
            getLifterListeners();
        })
        .catch(err=>console.error(RangeError));
}

