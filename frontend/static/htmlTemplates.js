
export const setUpdateFormTemplateHTML = (liftInfo, unit) => 
    `<form class="setUpdate" data-set-i-d="${liftInfo.setID}" data-set-workout-i-d="${liftInfo.workoutID}" data-lift-info='${JSON.stringify(liftInfo)}'>
        <div class="inputWrapper">
            <input class="setInfoField setWeightUpdate" id="weight${liftInfo.setID}" type="text" value="${liftInfo.weight}">
            <div class="inputTag">${unit}</div>
        </div>
        <div class="inputWrapper">
            <input class="setInfoField setRepsUpdate" id="reps${liftInfo.setID}" type="text" value="${liftInfo.reps}">
            <div class="inputTag">REP</div>
        </div>
        <div class="inputWrapper">
            <input class="setInfoField setRPEUpdate" id="rpe${liftInfo.setID}" type="text" value="${liftInfo.rpe}">
            <div class="inputTag">RPE</div>
        </div>
        <div class="inputWrapper">
            <input class="setInfoField setButton" type="submit" value="○ UPDATE">
        </div>
    </form>
    <div class="setQualifiersWrapper">
        <div class="setQualifiers"> 
            <div class="qualifierTitle">working set</div>   
            <div class="checkbox" id="workingSetCheckBox"></div>
        </div>
        <div class="setQualifiers">
            <div class="qualifierTitle">paused</div>       
            <div class="checkbox" id="pausedSetCheckBox"></div>
        </div>
        <div class="setQualifiers"> 
            <div class="qualifierTitle">belt </div>      
            <div class="checkbox" id="beltedSetCheckBox"></div>
        </div>
        <div class="setQualifiers"> 
            <div class="qualifierTitle">unilateral</div>    
            <div class="checkbox" id="unilateralSetCheckBox"></div>
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
        <div class="qualifierIcons" id="workingSetIcon"> ⤴ </div>
        <div class="qualifierIcons" id="beltIcon"> ⊕ </div>
        <div class="qualifierIcons" id="pausedIcon"> ∥ </div>
        <div class="qualifierIcons" id="unilateralIcon"> ⋅ </div>
    </div>
</div>`;

    