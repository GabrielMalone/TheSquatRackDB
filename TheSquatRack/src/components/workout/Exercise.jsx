import './Exercise.css';
import SetRow from './SetRow';
import SetHeader from './SetHeader';
import SetNote from './SetNote';
import { useState, useId } from 'react';
import AddSet from './AddSet';

export default function Exercise({ exerciseName, idExercise, idWorkout, sets }) {
  // -------------------------------------------------------------
  const [showNoteMap, setShowNoteMap] = useState(new Map());
  const setHeadId = useId();
  const sortedSets = [...sets].sort((a, b) => a.setNumber - b.setNumber);
  // -------------------------------------------------------------
  return (
    <div className='exercise'>

      <div className='exerciseHeader'>
        {exerciseName}
      </div>

      <SetHeader key={setHeadId} />

      {sortedSets.map((set) => {

        return (
          <div className='setWrapper' key={set.idSet}>
            <SetRow 
              setData={set} 
              showNoteMap={showNoteMap}
              setShowNoteMap={setShowNoteMap}
              idWorkout={idWorkout}
              idExercise={idExercise}
            />
            {showNoteMap.has(set.idSet) && (
              <SetNote 
                key={set.idSet}
                note={set}
              />
            )}
          </div>
        );
      })}

      <AddSet 
        idExercise={idExercise} 
        idWorkout={idWorkout}
        setNum={sets.at(-1).setNumber + 1}
      />

    </div>
  );
}