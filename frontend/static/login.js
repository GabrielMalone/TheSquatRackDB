import { f } from "./lifterSidebar.js";
import { endpoint as end } from "./config.js";

export function loginClick(){
    const loginForm = document.querySelector(".loginBox");
    loginForm.addEventListener("submit", loginEvent);
}
function loginEvent(e){
    e.preventDefault();
    const userName = document.getElementById('loginUserName').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    console.log(userName, password);
    // set up the backend verification next. 
    f.post(end.LOGIN, {userName, password})
    .then(res=>{
        console.log(res);
        if (res.message === "success") {
            console.log("correct password");
        } else {
            console.log("incorrect password");
        }
    })
    .catch(err=>console.error(err));
}