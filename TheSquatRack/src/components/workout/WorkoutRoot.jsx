import './WorkoutRoot.css';
import WorkoutWindowManager from './WorkoutWindowManger';
import WorkoutHeader from './WorkoutHeader';
import Exercise from './Exercise';
import AddExercise from '../addExercise/AddExercise';
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { get, post } from "../../hooks/fetcher";
import { useContext, useRef, useEffect } from 'react';
import { DayContext } from '../calendar/DayContext';
import { WorkoutDataContext } from './workoutDataContext';
import { AuthContext } from '../login/authContext';


export default function WorkoutRoot(){

    // -----------------------------------------------------------------
    const { selectedDayId } = useContext(DayContext);
    const { setSelectedWorkoutId } = useContext(WorkoutDataContext);
    const { userData } = useContext(AuthContext);
    const rootRef = useRef(null);
    const queryClient = useQueryClient();
    // -----------------------------------------------------------------
    useEffect(()=>{
        rootRef.current?.
        scrollIntoView({behavior: "smooth", block: "center" });
    },[selectedDayId]);
    // -----------------------------------------------------------------
    // Trigger re-renders when backend data for a workout changes
    // -----------------------------------------------------------------
    const idUser    = userData.idUser;
    const date1     = selectedDayId
    const date2     = selectedDayId;
    const { data: workoutForDay } = useSuspenseQuery({
        queryKey: ["workouts", idUser, date1, date2],
        queryFn: () => 
            get(`getWorkoutsInDateRange?idUser=${idUser}&date1=${date1}&date2=${date2}`),
    });

    // -----------------------------------------------------------------
    const createNewWorkout = useMutation({
        mutationFn: () => {
            return post("createNewWorkout", {
                date: selectedDayId,
                idUser
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
        }
    }); 
    // -----------------------------------------------------------------
    const w = workoutForDay[0];
    useEffect(()=>{
        if (!w) {
            createNewWorkout.mutate();
            return;
        }
        setSelectedWorkoutId(w.idWorkout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [w, setSelectedWorkoutId]);
    // -----------------------------------------------------------------
    return (      
        <div className='workoutRoot' ref={rootRef}>

            <WorkoutWindowManager />

            <WorkoutHeader
                workoutDate={selectedDayId}
                workoutTitle={w?.workoutTitle}
                idWorkout={w?.idWorkout}
                key={w?.idWorkout}
            />

            {w?.lifts?.map(lift => {
                if (lift.exercise){
                    return (
                        <Exercise
                            key={lift.exercise}
                            exerciseName={lift.exercise}
                            idExercise={lift.idExercise}
                            idWorkout={w.idWorkout}
                            sets={lift.sets}
                        />)
                    }
                })
            }

            <AddExercise route={'workout'}/>

        </div>
    );
    // -----------------------------------------------------------------
}