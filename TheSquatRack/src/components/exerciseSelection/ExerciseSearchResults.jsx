import './ExerciseSearchResults.css';
import { useContext, useState } from 'react';
import { ExerciseSearchContext } from './ExerciseSearchContext';
import { WorkoutDataContext } from '../workout/workoutDataContext';
import { LayoutContext } from '../../layoutContext';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { post } from '../../hooks/fetcher';
import { AuthContext } from '../login/authContext.jsx';


export default function ExerciseSearchResults() {
    // -------------------------------------------------------------
    const [idExercise, setIdExercise] = useState(null);
    const { selectedWorkoutId } = useContext(WorkoutDataContext);
    const { searchResults } = useContext(ExerciseSearchContext);
    const { setChooseIsSelected, addExerciseRoute } = useContext(LayoutContext);
    const { userData } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const idUser = userData.idUser;
    // -------------------------------------------------------------
    const dot = <Icon icon="stash:circle-dot-solid" />;
    const id = selectedWorkoutId;

    // -------------------------------------------------------------
    const addSetRequest = useMutation({
        mutationFn: () => {
            return post("addExerciseToWorkout", {
                idWorkout : id,
                idExercise,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
            setChooseIsSelected(c=>!c);
        },
    });
    // -------------------------------------------------------------
    const addExerciseToTrackRequest = useMutation({
        mutationFn: () => {
            return post("addExerciseToTrackedLifts", {
                idUser,
                idExercise,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["prHistory"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["trackedLifts"],
                exact: false
            });
            setChooseIsSelected(c=>!c);
        },
    });
    // -------------------------------------------------------------
    function handleAddExercise(idExercise){
        setIdExercise(idExercise);
        if (addExerciseRoute === 'workout'){
            addSetRequest.mutate();
        }
        if (addExerciseRoute === 'prHistory'){
            addExerciseToTrackRequest.mutate();
        }
    }
    // -------------------------------------------------------------


    return ( 
        searchResults.length > 0 ? 
        <div className='searchResultsRoot'>

            <div className='exerciseSearchResultHeader'>
                <div className='exerciseNameSearchResultHeader'>Exercise</div>
                <div className='categorySearchResultHeader'>Category</div>
                <div className='descriptionSearchResultHeader'>Description</div>  
            </div>
     
            <div className='searchResultsListContainer'>
                {searchResults.map(res=>{
                    return (
                        <button 
                            className='searchResultItem'
                            key={res.exerciseID}
                            onClick={()=>handleAddExercise(res.exerciseID)}
                        >

                            <div key={res.exerciseName} 
                                className='searchResultName'
                            >
                                {res.exerciseName}
                            </div> 

                            <div key={res.category} 
                                className={"searchResultCategory" + " " + res.category}
                            >
                                {dot}
                                {res.category}
                
                            </div> 

                            <div key={res.exerciseDescription} 
                                className='searchResultDescription'
                            >
                                {res.Description}
                            </div> 

                        </button>
                    );
                })}
            </div>

        </div>
    : null);
    // -------------------------------------------------------------
}