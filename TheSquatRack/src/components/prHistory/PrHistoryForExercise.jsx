import './PrHistoryForExercise.css';
import { Icon } from '@iconify/react';
import { post } from '../../hooks/fetcher.jsx';
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { useContext } from 'react';
import { LayoutContext } from '../../layoutContext';
import { DayContext } from '../calendar/DayContext.js';
import { AuthContext } from '../login/authContext.jsx';

export default function PrHistoryForExercise({prData}){

    const { setWorkoutIsPresent } = useContext(LayoutContext);
    const { setSelectedDayId } = useContext(DayContext);
    const { userData } = useContext(AuthContext);
    const exerciseName = prData[0]?.exerciseName;
    const idExercise = prData[0]?.idExercise;
    const queryClient = useQueryClient();    

    const idUser = userData.idUser;
    // -------------------------------------------------------------
    function formatDate(date){
        const year  = date.slice(11,16);
        const month = date.slice(8,11);
        const day   = date.slice(5,8);
        return month + " " + day + " " + year;
    }
    // -------------------------------------------------------------
    const removeExerciseFromTracking = useMutation({
		mutationFn: () => {
			return post("removeExerciseFromTrackedLifts", {
                idUser,
                idExercise
            })
		},
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["trackedLifts"],
                exact: false
            });
        },
	});
    // -------------------------------------------------------------
    function handleRemoveExercise() {
        removeExerciseFromTracking.mutate();
    }
    // -------------------------------------------------------------
    function handlePrWorkoutVisit(date){
        const d = new Date(date);
        const fdate = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;
        setSelectedDayId(fdate);
        setWorkoutIsPresent(true);
    }
    // -------------------------------------------------------------
    return (
        <div className='prHistoryRowRoot'>

            <div className='prExerciseNameHeader'>
                <div className='prExerciseName'>{exerciseName}</div>
                <button
                    className='removeExerciseIcon'
                    aria-label={`remove exercise ${exerciseName} from pr list`}
                    onClick={handleRemoveExercise}
                >
                    <Icon icon='material-symbols-light:close-small-rounded' />
                </button>
            </div>

            <div className='prHistoryRepsContainer'>
                {prData.map(pr=>{
                    return (
                        pr.reps ?
                        <button 
                            className='prExerciseBox' 
                            key={pr.idSet}
                            arial-label={`pr on ${pr.date} of ${pr.weight} ${pr.unit} for ${pr.reps}. visit workout`}
                            onClick={()=>handlePrWorkoutVisit(pr.date)}
                        >
                            <div className='prReps'>{pr.reps}</div>
                            <div className='prWeightData'>
                                <div className='prWeight'>{pr.weight}</div>
                                <div className='prUnit'>{pr.unit}</div>
                            </div>
                            <div className='prDate'>{formatDate(pr.date)}</div>
                        </button> 
                        : null
                    );

                })}

            </div>

        </div>
    );
    // -------------------------------------------------------------
}