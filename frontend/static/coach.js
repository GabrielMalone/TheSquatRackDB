import { f} from "./lifterSidebar.js";
import { loggedinLifter } from "./login.js";
import { currLifter, LIFTERS, fillLifters, fillMenu } from "./lifterSidebar.js";
import { endpoint as c  } from "./config.js";
import { coachWrapperHTML } from "./htmlTemplates.js";

//-----------------------------------------------------------------------------
export async function isMyCoach(){
    return await f.post(c.IS_MY_COACH, {"idUser" : loggedinLifter.id , "potentialCoachID" : currLifter.id})
}
//-----------------------------------------------------------------------------
export async function IamTheirCoach(){
    return await f.post(c.AM_I_COACH, {"idUser" : loggedinLifter.id, "potentialClientID" : currLifter.id})
}
//-----------------------------------------------------------------------------
export async function setCoachIcon(){
    createCoachWrapper();
    const wrapper = document.getElementById('isCoachWrapper');
    if (currLifter.id === loggedinLifter.id) {
        wrapper.style.display = "none";
    } else {
        wrapper.style.display = "flex";
    }
    if (await isMyCoach()) {
        setCoachText("my coach");
    } else {
        setCoachText("make coach");
    }
}
//-----------------------------------------------------------------------------
function createCoachWrapper(){
    const prevSibling = document.querySelector('#isCoachWrapper')?.previousElementSibling;
    const coachWrapper = document.querySelector('#isCoachWrapper');
    if (coachWrapper){
        coachWrapper.remove();
        prevSibling.insertAdjacentHTML("afterend",coachWrapperHTML);
    } else {
        document.querySelector('#space').insertAdjacentHTML("afterend", coachWrapperHTML);
    } 
}
//-----------------------------------------------------------------------------
function setCoachText(text){
    const coachText = document.getElementById('coachText');
    if (coachText) coachText.innerText = text;
    const wrapper = document.getElementById('isCoachWrapper');
    if (wrapper) wrapper.classList.remove('active');
}
//-----------------------------------------------------------------------------
export async function setCoachStatus(){
    if (await isMyCoach()) {
        await f.post(c.SET_COACH, {"clientID" : loggedinLifter.id, "coachID" : null})
        await setCoachIcon();
    } else {
        await f.post(c.SET_COACH, {"clientID" : loggedinLifter.id, "coachID" : currLifter.id})
        await setCoachIcon();        
    }
}
//-----------------------------------------------------------------------------
export function getMyAthletes(){
    f.post(c.GET_MY_ATHLETES, loggedinLifter.id)
    .then(athletes=>{
        LIFTERS.length = 0;
        fillLifters(athletes);  // create lifter objects from lifters in the db
        fillMenu()                     // fill out the menu with active lifters
        LIFTERS.push(loggedinLifter);
    })
    .catch(err=>console.error(err));
}