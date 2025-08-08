
export const setUpdateFormTemplateHTML = (liftInfo, unit) => 
    `
    <form class="setUpdate" data-set-i-d="${liftInfo.setID}" data-set-workout-i-d="${liftInfo.workoutID}" data-lift-info='${JSON.stringify(liftInfo)}'>
        <div class="inputWrapper">
            <div class="inputTag">${unit}</div>
            <input class="setInfoField setWeightUpdate" id="weight${liftInfo.setID}" type="text" value="${liftInfo.weight}">
        </div>
        <div class="inputWrapper">
            <div class="inputTag">REP</div>
            <input class="setInfoField setRepsUpdate" id="reps${liftInfo.setID}" type="text" value="${liftInfo.reps}">
        </div>
        <div class="inputWrapper">
            <div class="inputTag">RPE</div>
            <input class="setInfoField setRPEUpdate" id="rpe${liftInfo.setID}" type="text" value="${liftInfo.rpe}">
        </div>
        <div class="inputWrapper">
            <input class="setInfoField setButton" type="submit" value="✓">
        </div>
    </form>
    <div class="setQualifiersWrapper">
        <div class="setQualifiers"> 
            <div class="UpdatequalifierIcons" id="UpdateworkingSetIcon">working set</div>  
        </div>
        <div class="setQualifiers"> 
            <div class="UpdatequalifierIcons" id="UpdatebeltIcon">belt</div>    
        </div>
        <div class="setQualifiers">
            <div class="UpdatequalifierIcons" id="UpdatepausedIcon">paused</div>      
        </div>
        <div class="setQualifiers"> 
            <div class="UpdatequalifierIcons" id="UpdateunilateralIcon">unilateral</div>  
        </div>
    </div>   
`;
//-----------------------------------------------------------------------------
export const setTemplateHTML = (liftInfo) => 
`<div class="setInfoWrapper data-set-i-d="${liftInfo.setID}">
    <div class="weightsANDrpeWrapper">
        <div class="setWeightRepsWrapper">
            <div class="setInfo setWeight">${liftInfo.weight}</div> 
            <div class="setInfo setBy">&nbsp;x&nbsp;</div> 
            <div class="setInfo setReps">${liftInfo.reps}</div>
        </div>
        <div class="setRPEwrapper">
            <div class="setInfo setRPETitle">RPE</div>
            <div class="setInfo setRPE">${liftInfo.rpe}</div>
        </div>
    </div>
    <div class="qualifierIconsWrapper">
        <div class="qualifierIcons" id="workingSetIcon"> working set </div>
        <div class="qualifierIcons" id="beltIcon"> belt </div>
        <div class="qualifierIcons" id="pausedIcon"> paused </div>
        <div class="qualifierIcons" id="unilateralIcon"> unilateral </div>
    </div>
</div>`;
//-----------------------------------------------------------------------------
export const sessionTitleFormHTML = (liftInfo) => {
    if (liftInfo.length===0) return "";
    const html = 
    `
    <form class="nameSetForm" data-id-workout="${liftInfo[0].idWorkout}">
        <div class="nameSetForminputWrapper">
            <div class="nameSetinputTag">Title:</div>
            <input class="setInfoField sessionNameInput" type="text" value="${liftInfo[0].sessionTitle ?? "unnamed"}">
            <input class="setInfoField setButton nameSetButton" type="submit" value="✓">
        </div>
    </form>
    `
    return html;
}
//-----------------------------------------------------------------------------
export const lifterSidebarSearch = 
    `
    <div class="lifterSidebarDashWrapper">
        <div class="findLifterWrapper">
            <form class="findLifterForm">
                <div id="searchLifterButton">⌕</div>
                <input class="findLifterInput" type="text" placeholder="search by username" value="">
            </form>
        </div>
    </div>
    `
//-----------------------------------------------------------------------------
export const lifterDashHeaderContent = `
    <div id="lifterHeaderName"></div>
    <div id="lifterConfig">○</div>
    <div id="space"></div>
`
//-----------------------------------------------------------------------------
export const coachWrapperHTML = 
   `<div id="isCoachWrapper">
        <div id="coachText"></div>
        <div id="coachIcon">♛</div>
    </div>`;