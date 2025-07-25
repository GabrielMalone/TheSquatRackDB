
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
            <div class="UpdatequalifierIcons" id="UpdateworkingSetIcon">⇧</div>  
        </div>
        <div class="setQualifiers"> 
            <div class="UpdatequalifierIcons" id="UpdatebeltIcon">◎</div>    
        </div>
        <div class="setQualifiers">
            <div class="UpdatequalifierIcons" id="UpdatepausedIcon">⏸</div>      
        </div>
        <div class="setQualifiers"> 
            <div class="UpdatequalifierIcons" id="UpdateunilateralIcon">⚋</div>  
        </div>
    </div>   
`;
//-----------------------------------------------------------------------------
export const setTemplateHTML = (liftInfo) => 
`<div class="setInfoWrapper data-set-i-d="${liftInfo.setID}">
    <div class="setWeightRepsWrapper">
        <div class="setInfo setWeight">${liftInfo.weight}</div> 
        <div class="setInfo setBy">&nbsp;x&nbsp;</div> 
        <div class="setInfo setReps">${liftInfo.reps}</div>
    </div>
    <div class="setRPEwrapper">rpe&nbsp; 
        <div class="setInfo setRPE">${liftInfo.rpe}</div>
    </div>
    <div class="qualifierIconsWrapper">
        <div class="qualifierIcons" id="workingSetIcon"> ⇧ </div>
        <div class="qualifierIcons" id="beltIcon"> ◎ </div>
        <div class="qualifierIcons" id="pausedIcon"> ⏸ </div>
        <div class="qualifierIcons" id="unilateralIcon"> ⚋ </div>
    </div>
</div>`;
//-----------------------------------------------------------------------------
export const sessionTitleFormHTML = (liftInfo) =>
`
<form class="nameSetForm" data-id-workout="${liftInfo[0].idWorkout}">
    <div class="nameSetForminputWrapper">
        <div class="nameSetinputTag">Title:</div>
        <input class="setInfoField sessionNameInput" type="text" value="${liftInfo[0].sessionTitle}">
        <input class="setInfoField setButton nameSetButton" type="submit" value="✓">
    </div>
</form>
`