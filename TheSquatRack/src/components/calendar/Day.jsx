import './Day.css';
import { useContext } from 'react';
import { LayoutContext } from '../../layoutContext';
import { DayContext } from './DayContext';
import { Icon } from '@iconify/react';

export default function Day({d, workoutData}){

    const { setWorkoutIsPresent } = useContext(LayoutContext);
    const { setSelectedDayId }   = useContext(DayContext);

    const dot = <Icon icon="stash:circle-dot" />;
    // ---------------------------------------------------------
    let title = workoutData[0]?.workoutTitle;

    let squat = false;
    let bench = false;
    let dead  = false;
    let accs  = false;

    if (workoutData[0]){
        for (const lift of workoutData[0].lifts){
            if (lift.category === "squat") squat = true; 
            if (lift.category === "bench") bench = true;
            if (lift.category === "deadlift") dead = true;
            if (lift.category === "accessory") accs = true;
        }
    }
    // ---------------------------------------------------------
    function dayClick(){
        setSelectedDayId(d.id);
        setWorkoutIsPresent(true);
    }

    return (
        <button className={
            `dayContainer ${!d.inCurrentMonth ? "otherMonth" : ""} ${d.isToday ? "isToday": ""}`} 
            onClick={dayClick}
            aria-label={`calendar day ${d.id}`}
        >

            <div className={`dayNumber ${d.isToday ? "isToday" : ""}`}>
                {d.day}
            </div>

            <div className='dayBody'>
                <div className='title'>{title ? title : null}</div>
            </div>

            <div className='exercisesContainer'>
                <div className='S'>{squat ? dot : ""}</div>
                <div className='B'>{bench ? dot : ""}</div>
                <div className='D'>{dead  ? dot : ""}</div>
                <div className='A'>{accs  ? dot : ""}</div>
            </div>

        </button>
    );
}