import { f } from "./lifterSidebar.js";
import { endpoint as c } from "./config.js";
import { LIFTERS, getLifters } from "./lifterSidebar.js";
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
// event listener for the new lifter submit button
//-----------------------------------------------------------------------------
export const submitNewLifterClick = () => {
    const submitButton = document.querySelector(".createLifterFields");
    submitButton.addEventListener("submit", submitNewLifter);
}
//-----------------------------------------------------------------------------
// This is the logic for clicking the submit new lifter button.
//-----------------------------------------------------------------------------
export const submitNewLifter = (e) => {
    e.preventDefault();
    let userName    = document.getElementById("inputUserName").value.trim();
    const firstName = document.getElementById("inputFirst").value.trim();
    const lastName  = document.getElementById("inputLast").value.trim();
    const email     = document.getElementById("inputEmail").value.trim();
    const errField  = document.getElementById("submitErrorMsg");
    // can do validation stuff here. 
    if (userName.length < 4){
        errField.innerText = "User name must be at leat 4 characters long";
        return;
    }
    userName = userName[0].toUpperCase() + userName.slice(1);
    const newLifter = {
        Email: email || null,
        userFirst: firstName || null,
        userLast: lastName || null,
        userName: userName
    };
    postNewLifter(newLifter);           // if all good send datato the database
}
//-----------------------------------------------------------------------------
// post method to create new lifter in database
//-----------------------------------------------------------------------------
export const postNewLifter = (newLifter) => {
    const errField  = document.getElementById("submitErrorMsg");
    f.post(c.LIFTERS_ENDPOINT, newLifter)
    .then(res=>{
        if (res===200){                   // close the newLifter window if done
            document.querySelector(".createLifterBox").classList.toggle("visible");
            LIFTERS.length = 0;
            getLifters();
        } else {                                             // 1062 error code
            errField.innerText = "username already taken"
        }
    })
    .catch(err=>console.error(err));
}