import './ExerciseSelectionRoot.css';
import ExerciseSelectionWindowManager from './ExerciseSelectionWindowManager';
import ExerciseSelectionSearchBar     from './ExerciseSelectionSearchBar';
import ExerciseSearchResults from './ExerciseSearchResults';
import { ExerciseSearchContext } from './ExerciseSearchContext';
import { useState } from 'react';


export default function ExerciseSelectionRoot(){

    const [searchResults, setSearchResults] = useState([]);

    return (
        <ExerciseSearchContext.Provider value={{searchResults, setSearchResults}}> 
            <div className='exerciseSelectionRoot'>
                <ExerciseSelectionWindowManager />
                <ExerciseSelectionSearchBar />
                <ExerciseSearchResults />
            </div>
        </ExerciseSearchContext.Provider>  
    );
}