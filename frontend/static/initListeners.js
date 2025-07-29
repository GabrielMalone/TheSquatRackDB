import { lifterHeaderListener } from "./dashboards/lifterHeaderDash.js";
import { calendarListener, dayEventListener } from "./dashboards/calendarDash.js";
import { headerListeners } from "./header.js";
import { createFakeUsers, submitNewLifterClick } from "./newLifterSideBar.js";
import { loginClick } from "./login.js";
import { getLifterListeners } from "./lifterSidebar.js";

//-----------------------------------------------------------------------------
// all the listeners that need to be loaded for the app to work
// these are not all the listeners that will eventually exist, 
// but they are the ones that just need to created once and are never destroyed
// while the page is open.
// could probably move some of these to their respective modules
//-----------------------------------------------------------------------------
export function init() {
    //-------------------------------------------------------------------------
    calendarListener();         // detects key input for changing months in cal
    dayEventListener();               // detecting click on day in the calendar
    lifterHeaderListener();
    getLifterListeners();
    headerListeners();                   // detects button clicks in the header
    submitNewLifterClick();       // detects new lifter button submission click
    loginClick();                                 // detects login button click
    // createFakeUsers();
    //-------------------------------------------------------------------------
}