import { f } from "./lifterSidebar.js";
import { endpoint as c } from "./config.js";
import { LIFTERS, getLifters } from "./lifterSidebar.js";
import { login } from "./login.js";
import { mockUsers } from "./mockUserData.js";
//-----------------------------------------------------------------------------
// This clears all the input fields for the create new lifter window
//-----------------------------------------------------------------------------
export const clearNewLifterFields = () => {
    document.getElementById("inputUserName").value = "";
    document.getElementById("inputFirst").value = "";
    document.getElementById("inputLast").value = "";
    document.getElementById("inputEmail").value = "";
    document.getElementById("inputPassword").innerText = "";
    document.getElementById("submitErrorMsg").innerText = "";
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
const submitNewLifter = (e) => {
    e.preventDefault();
    let userName    = document.getElementById("inputUserName").value.trim();
    const password  = document.getElementById("inputPassword").value.trim();
    const firstName = document.getElementById("inputFirst").value.trim();
    const lastName  = document.getElementById("inputLast").value.trim();
    const email     = document.getElementById("inputEmail").value.trim();
    const errField  = document.getElementById("submitErrorMsg");

    // email dupilicate check on backend
    // username duplicate check on backend
    if (!userNameValid(userName, errField)) return;
    if (!passwordChecks(password, errField)) return;

    // could write a function here to create a bunch of test users


    const newLifter = {
        Email: email,
        userFirst: firstName || null,
        userLast: lastName || null,
        userName: userName,
        password: password
    };
    postNewLifter(newLifter);           // if all good send datato the database
}
//-----------------------------------------------------------------------------
export function createFakeUsers(){
    mockUsers.forEach(user=>{
        const newLifter = {
            Email: user.Email,
            userFirst: user.userFirst || null,
            userLast: user.userLast || null,
            userName: user.userName,
            password: user.password
        };
        postNewLifter(newLifter);
    })
}
//-----------------------------------------------------------------------------
// userName checks
//-----------------------------------------------------------------------------
function userNameValid(userName, errField){
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_.-]{2,19}$/;
    if (! usernameRegex.test(userName)){
        errField.innerHTML = 
            `<p>Username must be between 3 and 20 characters</p>
             <p>Username may not start with a number</p>
             <p>Username may contain only letters, digits, -, _, .</p>`;
        return false;
    }
    return true;
}
//-----------------------------------------------------------------------------
function passwordChecks(password, errField){
    if (password.length < 8){
        errField.innerHTML = `<p>password must be at least 8 characters in length</p>`
        return false;
    }
    return true;
}
//-----------------------------------------------------------------------------
// post method to create new lifter in database
//-----------------------------------------------------------------------------
export const postNewLifter = (newLifter) => {
    const errField  = document.getElementById("submitErrorMsg");
    f.post(c.LIFTERS_ENDPOINT, newLifter)
    .then(res=>{
        if (res===200){                   // close the newLifter window if done
            document.querySelector(".newLifterWrapper").classList.toggle("visible");
            LIFTERS.length = 0; 
            getLifters();  // basically for admin right now need to change this
            login(newLifter.userName, newLifter.password);
        } else {                                   // 1062 duplicate error code
            errorMsg(res, errField);
        }
    })
    .catch(err=>console.error(err));
}
//-----------------------------------------------------------------------------
// make a nice message from the sql error code
//-----------------------------------------------------------------------------
function errorMsg(res, errField){
    let token = "";   // all this just pulling out first msg that appears in ''
    let begin = false;
    let cnt = 0;
    for ( let i = 0 ; i < res.message.length ; i ++ ){
        if (res.message[i] === "'"){
            begin = !begin;
            cnt ++;
        }
        if (begin) token += res.message[i];
        if (cnt === 3) break;
    }
    errField.innerText = token + " already taken";
}