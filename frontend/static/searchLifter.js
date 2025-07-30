import { f, fillLifters, fillMenu, LIFTERS, clearLifters, getLiftersIfollow } from "./lifterSidebar.js";
import { endpoint as end  } from "./config.js";

//-----------------------------------------------------------------------------
// return results from user keystrokes in lifter search bar 
//-----------------------------------------------------------------------------
export function findLifter(){
    const searchBar = document.querySelector('.findLifterInput'); 
    const userInput = searchBar.value;
    if (userInput.length < 2) {
        clearLifters();
        if (userInput.length === 0){
            getLiftersIfollow();
        }
        return;
    }
    f.post(end.SEARCH_FOR_LIFTER, userInput)
        .then(res=>{
            LIFTERS.length = 0;                            // reset each search
            if (res.length === 0){ // clear active lifter results if none found
                clearLifters();
                return;
            }
            fillLifters(res);   // create lifter objects from lifters in the db
            fillMenu()                 // fill out the menu with active lifters
        })
        .catch(err=>console.error(RangeError));
}

