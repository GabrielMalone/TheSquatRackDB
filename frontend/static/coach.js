import { f} from "./lifterSidebar.js";
import { loggedinLifter } from "./login.js";
import { currLifter } from "./lifterSidebar.js";
import { endpoint as c  } from "./config.js";

//-----------------------------------------------------------------------------
export async function isMyCoach(){
    const res = await f.post(c.IS_MY_COACH, {"idUser" : loggedinLifter.id , "potentialCoachID" : currLifter.id})
    console.log(res);
    return res;
}
//-----------------------------------------------------------------------------
export async function setCoachIcon(){
    if (currLifter.id === loggedinLifter.id){
        const wrapper = document.getElementById('isCoachWrapper');
        if (wrapper) wrapper.style.display = "none";
    } else {
        const wrapper = document.getElementById('isCoachWrapper');
        if (wrapper) wrapper.style.display = "flex";
    }
    if (await isMyCoach()){
        const coachText = document.getElementById('coachText');
        if (coachText) coachText.innerText = "my coach";
    } else {
        const coachText = document.getElementById('coachText');
        if (coachText) coachText.innerText = "make coach";
    }
}
//-----------------------------------------------------------------------------
export async function setCoachStatus(){
    if (await isMyCoach()){
        console.log("removing coach");
        await f.post(c.SET_COACH, {"clientID" : loggedinLifter.id, "coachID" : null})
        await setCoachIcon();
    } else {
        console.log("adding coach");
        await f.post(c.SET_COACH, {"clientID" : loggedinLifter.id, "coachID" : currLifter.id})
        await setCoachIcon();        
    }
}