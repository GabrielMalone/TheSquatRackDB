import { currLifter, LIFTERS , setCurrlifter} from "../lifterSidebar.js";
import { loggedinLifter } from "../login.js";
import { loginLogout } from "../login.js";
import { f } from "../lifterSidebar.js";
import { endpoint as c } from "../config.js";
import { lifterDashHeaderContent } from "../htmlTemplates.js";
import { followLifterEvent, Ifollow, unfollowLifterEvent } from "../follow.js";
import { setCoachStatus } from "../coach.js";



const lifterBoxHeader = document.querySelector('.lifterBoxHeader');


export function lifterHeaderListener(){
    // first clearn and add all the content to the header
    lifterBoxHeader.innerHTML = ``;
    lifterBoxHeader.innerHTML = lifterDashHeaderContent;
    lifterBoxHeader.addEventListener("click", lifterHeaderEvents);
}
async function lifterHeaderEvents(e){
    if (e.target.id === 'lifterConfig'){
        configClickEvent();
    }
    if (e.target.id === 'followIcon'){
        const IdoFollow = await Ifollow();
        if ( IdoFollow ) unfollowLifterEvent();
        else followLifterEvent();
    }
    if (e.target.id === 'coachIcon'){
        setCoachStatus();
    }
}
//------------------------------------------------------------------------------
// the action for clicking on a lifter's config button
// for now this just deletes the user
//------------------------------------------------------------------------------
function configClickEvent(){
    if (currLifter.id !== loggedinLifter.id) {
        return;
    }
    loginLogout("out");    
    const createLifterButon = document.getElementById('addLifter')
    const partnerList       = document.querySelector('.sidebar');
    const loginBox      = document.querySelector('.loginBoxWrapper');  
    const calendar      = document.querySelector(".month");
    const lifterName    = document.getElementById("lifterHeaderName");
    const workoutDash   = document.querySelector(".workout");
    const dateWrapper   = document.querySelector(".dateWrapper");
    const prDash        = document.querySelector(".prDash");
    const prDashHeader  = document.querySelector("#prDashHeader");
    const monthlyChartDashWrapper = document.querySelector('.monthlyChartDashWrapper');
    const cursorForPRDash = document.getElementById('cursorForprDashBoard');
    const dashHeaders       = document.querySelectorAll('.dashHeader');
    
    lifterBoxHeader.innerHTML = ``;

    loginBox.classList.remove('hidden');
    createLifterButon.classList.remove('hidden');
    dashHeaders.forEach(header=>header.parentNode.removeChild(header));
    if (activeLifters.classList.contains('visible')){
        activeLifters.classList.remove('visible');
    }
    f.delete(c.LIFTERS_ENDPOINT, currLifter.id)    // logic to delete currlifter
    .then(()=>{
        LIFTERS.length = 0;
        // getLifters();
        setCurrlifter(null);
        partnerList.innerHTML = ``;
        partnerList.classList.remove('visible');
        lifterName.innerHTML      = ``; // clear out the main lifter window
        calendar.style.display    = "none";
        workoutDash.style.display = "none";
        dateWrapper.style.display = "none";
        monthlyChartDashWrapper.innerHTML = ``;
        prDash.innerHTML = ``;
        prDashHeader.innerHTML = ''
        cursorForPRDash.parentNode?.removeChild(cursorForPRDash);
    })
    .catch(err=>console.error(err));
}
//------------------------------------------------------------------------------