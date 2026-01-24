import './AddSet.css';
import { Icon } from "@iconify/react";
import { post } from '../../hooks/fetcher.jsx';
import { useMutation, useQueryClient} from "@tanstack/react-query";

export default function AddSet({ idExercise, idWorkout, setNum }){
    // -------------------------------------------------------------
    const queryClient = useQueryClient();
    // -------------------------------------------------------------
    const addSetRequest = useMutation({
		mutationFn: () => {
			return post("addSet", {
                setNum,
                idWorkout,
                idExercise,
            })
		},
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
        },
	});
    // -------------------------------------------------------------
    function handleAddSet(){
        addSetRequest.mutate();
    }
    // -------------------------------------------------------------
    return (
        <div className='addSetContainer'>

            <button 
                className='addSetIcon'
                aria-label='add set'
                onClick={handleAddSet}
            >
                <Icon icon="ic:baseline-add-box" />
            </button>

            <div className='addSetText'>
                <p>add set</p>
            </div>

        </div>
    );
}