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