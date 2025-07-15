import { submitNewLifterClick, configEventListener, getLifters } from "./lifterSidebar.js";
import { calendarListener, dayEventListener } from "./dashboards/calendar.js";
import { addLifterClick, activeLiftersCLick } from "./header.js";
import { xNewLifterWindow } from "./newLifterSideBar.js";

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
    activeLiftersCLick();                 // detects click on lifter in sidebar
    dayEventListener();               // detecting click on day in the calendar
    configEventListener();                  // config button in the main window
    xNewLifterWindow();                    // x button on the new lifter window
    addLifterClick();                        // add lifter button in the header
    submitNewLifterClick();            // submit button for new lifter creation
    //-------------------------------------------------------------------------
    getLifters();                             // load lifters from the database
}