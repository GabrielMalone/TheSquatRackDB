import './WorkoutHeader.css';
import { useState } from 'react';
import cleanDate from '../calendar/cleanDate.js'
import { post } from '../../hooks/fetcher.jsx';
import { useMutation, useQueryClient} from "@tanstack/react-query";

export default function WorkoutHeader({workoutDate, workoutTitle, idWorkout}){
    // -------------------------------------------------------------
 

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(workoutTitle ?? "");
    // -------------------------------------------------------------
    // editing needs to update backend on enter / escape / blur
    // -------------------------------------------------------------
    const queryClient = useQueryClient();
    
    const updateWorkoutTitle = useMutation({
        mutationFn: () => {
            return post("updateWorkoutTitle", {
                title: draft,
                idWorkout,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
        }
    });
    // -------------------------------------------------------------
    function handleKey(e){
        if (e.key === "Enter"){
            setDraft(e.target.value);
            updateWorkoutTitle.mutate();
            setEditing(false);
        } 
        if (e.key === "Escape"){
            setEditing(false);
        } 
    }
    // -------------------------------------------------------------
    return(
        <div className='workoutHeader'>

            <div className='workoutTitle'>
                {   
                    editing       ? 
                    <input 
                        type="text"
                        value={draft ?? "Session Title"}
                        maxLength={20}
                        onChange={e=>setDraft(e.target.value)}
                        onBlur={()=>{
                            updateWorkoutTitle.mutate();
                            setEditing(false);
                        }}  
                        onKeyDown={handleKey}
                        autoFocus
                        />
                    :  
                    <button
                        onClick={()=>setEditing(true)}
                        aria-label={`session title`} >
                        {draft || "Session Title"}
                    </button> 
                }
            </div>

            <div className='workoutDate'>
                {cleanDate(workoutDate)}
            </div>

        </div>
    );
    // -------------------------------------------------------------
}