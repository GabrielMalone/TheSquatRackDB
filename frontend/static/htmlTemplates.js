
export const setUpdateFormTemplateHTML = (liftInfo, unit) => `

<form class="setUpdate" data-set-i-d="${liftInfo.setID}" data-set-workout-i-d="${liftInfo.workoutID}" data-lift-info='${JSON.stringify(liftInfo)}'>
    <div class="inputWrapper">
        <input class="setInfoField setWeightUpdate" id="weight${liftInfo.setID}" type="text" value="${liftInfo.weight}">
        <div class="inputTag">${unit}</div>
    </div>
    <div class="inputWrapper">
        <input class="setInfoField setRepsUpdate" id="reps${liftInfo.setID}" type="text" value="${liftInfo.reps}">
        <div class="inputTag">reps</div>
    </div>
    <div class="inputWrapper">
        <input class="setInfoField setRPEUpdate" id="rpe${liftInfo.setID}" type="text" value="${liftInfo.rpe}">
        <div class="inputTag">RPE</div>
    </div>
    <div class="inputWrapper">
        <input class="setInfoField setButton" type="submit" value="⠀⃝ update">
    </div>
</form>
`;

export const setTemplateHTML = (liftInfo) => 
    
`    <div class="setInfoWrapper data-set-i-d="${liftInfo.setID}">
        <div class="setWeightRepsWrapper">
            <div class="setInfo setWeight">${liftInfo.weight}</div> 
            <div class="setInfo setBy">&nbsp;x&nbsp;</div> 
            <div class="setInfo setReps">${liftInfo.reps}</div>
        </div>
        <div class="setRPEwrapper">rpe&nbsp; 
            <div class="setInfo setRPE">${liftInfo.rpe}</div>
        </div>
    </div>`;

export const ExerciseDashTemplate = () => `
  <div class="addExerciseDash">
  
    <div class="addExerciseBoxHeader">
      <div id="addExerciseTitle">Select Exercise</div>
      <div id="addExerciseX">X</div>
    </div>

    <div class="exerciseSelectionWrapper">

      <div class="SquatCategory">
        <div class="CategoryHeader">Squat</div>
          <div class="exercisesInDB">
            <ul class="squatExerciseMenu"></ul>
          </div>
      </div>

      <div class="BenchCategory">
        <div class="CategoryHeader">Bench</div>
          <div class="exercisesInDB">
            <ul class="benchExerciseMenu"></ul>
        </div>
      </div>

      <div class="DeadliftCategory">
        <div class="CategoryHeader">Deadlift</div>
          <div class="exercisesInDB">
            <ul class="deadliftExerciseMenu"></ul>
        </div>
      </div>

      <div class="AccessoriesCategory">
        <div class="CategoryHeader">Accessory</div>
          <div class="exercisesInDB">
            <ul class="accessoryExerciseMenu"></ul>
          </div>
      </div>

    </div>

    <div class="exerciseDescriptionWrapper">
      <div class="exerciseDescription"></div>
    </div>

  </div>
`