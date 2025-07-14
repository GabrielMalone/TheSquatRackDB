import { f } from "./lifterActions.js";
import { config } from "./config.js";


const repRange = 10;

//-----------------------------------------------------------------------------
// creates the lifetime pr chart and fetches the data to fill in the chart
//-----------------------------------------------------------------------------
export async function createPrDash(exerciseList, idUser){

    let curPr; // debugging 

    const prDash = initPrDash();
    for (const liftID of exerciseList) {    // get info for exercises passed in
        const exerciseInfo = await f.post(config.GET_EXERCISE_INFO, liftID);
        const curLiftRow = buildLiftRow(exerciseInfo, prDash, idUser, liftID);
        f.post(config.GET_PR_DATA_FOR_LIFT, {idUser, "lift" : liftID})//pr data
        .then(prs=>{
            prs.forEach(pr=>{        //iterate prs, get corresponding box by id
                curPr = pr;
                if(pr.reps > repRange || pr.reps === 0) return;                   // cap at 20 for now
                const repBox = curLiftRow.querySelector(`#${exerciseInfo.abbrev}_rep_${pr.reps}`);
                repBox.dataset.weight   = pr.weight;
                repBox.dataset.reps     = pr.reps;
                repBox.dataset.date     = pr.date;
                if (! repBox.innerHTML && pr.weight){
                    repBox.innerHTML = `<div class="prWeight">${pr.weight}</div>`;
                    repBox.classList.add("prPresent");
                } 
            });
        })
        .catch(err=>{
            console.error(err); 
            console.log(curPr);
        });
    }
    buildPrDashHeader(prDash);
    prInfoClick(prDash); // listen for clicks on PRs
}
//-----------------------------------------------------------------------------
// helper methods for the createPrDash ^
//-----------------------------------------------------------------------------
function initPrDash(){
    const prDash = document.querySelector(".prDash"); // build the dash headers
    const repsTitle = buildRepsTitle(prDash);
    buildRepsHeader(repsTitle);                  // build the rows of exercises 
    return prDash;
}

function buildPrDashHeader(prDash){
    prDash.insertAdjacentHTML("afterbegin",`  
            <div class="prDashHeader">
                <div class="prDashHeaderTitle">PR DASH</div>
                <div class="prDashMinimizer">-</div>
            </div>     `);
    const width = prDash.offsetWidth;
    const prDashHeader = document.querySelector(".prDashHeader");
    prDashHeader.style.width = `${width}px`;
    const miniMizer = document.querySelector(".prDashMinimizer");
    miniMizer.addEventListener("click", minimizePrDash);
}
function minimizePrDash(){
    const prDash = document.querySelector(".prDash");
    prDash.classList.toggle("prDashVisible");
}

function buildRepsTitle(prDash){
    const repsTitle = document.createElement('div');
    repsTitle.classList.add("prRepsTitle");
    repsTitle.classList.add('prCell');
    repsTitle.innerHTML = ``;
    prDash.append(repsTitle);
    return repsTitle;
}
function buildRepsHeader(repsTitle){
    for (let i = 0 ; i <= repRange ; i ++ ){
        const repNumberBox = document.createElement('div');
        repNumberBox.setAttribute("id", `repNumberBoxInHeader_${i}`);
        repNumberBox.classList.add("repNumberBoxInHeader");
        repNumberBox.classList.add('prCell');
        if (i > 0) repNumberBox.innerHTML = `<div class="repNumInHeader">${i}</div>`;
        repsTitle.append(repNumberBox);
    }    
}
function buildRepPrBox(lift, rep){
    const repPRbox = document.createElement('div');
    if (rep === 0){ // place name of lift at start
        repPRbox.classList.add("prLiftNameBox");
        repPRbox.innerHTML = `<div class="prLiftName">${lift.abbrev}</div>`;
        repPRbox.classList.add('prCell');
        return repPRbox;
    }  
    repPRbox.classList.add("repPRbox"); 
    repPRbox.setAttribute("id", `${lift.abbrev}_rep_${rep}`);
    repPRbox.classList.add('prCell');
    return repPRbox;

}
function buildLiftRow(lift, prDash, idUser, liftID){
    const liftRow = document.createElement('div');
    liftRow.classList.add("prLiftRow");
    liftRow.setAttribute("id", `${lift.abbrev}PR`);
    prDash.append(liftRow);
    for (let i = 0 ; i < repRange + 1 ; i ++ ){
        liftRow.append(buildRepPrBox(lift, i, idUser, liftID));
    }
    return liftRow;
}

function prInfoClick(prDash){
    prDash.addEventListener("click", (e)=>{
        if (e.target.classList.contains("prPresent")){
            console.log("prclickorking");
        }
    });

}