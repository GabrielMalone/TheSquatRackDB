import './Month.css';
import Day from "./Day";
import DaysOfTheWeek from './DaysOfTheWeek';
import { get } from '../../hooks/fetcher.jsx'
import { useContext } from 'react';
import { CalendarContext } from './calendarContext';
import { AuthContext } from '../login/authContext.jsx';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function Month(){
    const { userData } = useContext(AuthContext);
    const calendar = useContext(CalendarContext);
    const idUser = userData.idUser;
    // -------------------------------------------------------------------------
    const date1 = calendar.days[0].id; // get all the workouts that will show up
    const date2  = calendar.days.at(-1).id; // on the calendar UI
    // -------------------------------------------------------------------------
    const {data : workouts} = useSuspenseQuery({
        queryKey: ["workouts", idUser, date1, date2],
        queryFn: () => get(`getWorkoutsInDateRange?idUser=${idUser}&date1=${date1}&date2=${date2}`),
    });
    // -------------------------------------------------------------------------
    return (
        <div className='month'>
            <DaysOfTheWeek />
            {calendar.days.map((day, i)=>{
                return <Day key={i} 
                    d={day} 
                    workoutData={workouts.filter(
                    workout=>{
                        const d = new Date(workout.date);
                        if (d.getUTCDate()      === day.day &&
                            d.getUTCMonth()     === day.month &&
                            d.getUTCFullYear()  === day.year ){
                            return workout;
                        }
                    }
                )}/>
            })}
        </div>
    );
    // -------------------------------------------------------------------------
}
