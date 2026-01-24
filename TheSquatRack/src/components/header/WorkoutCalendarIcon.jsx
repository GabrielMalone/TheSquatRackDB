import './WorkoutCalendarIcon.css';
import { Icon } from '@iconify/react';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';

export default function WorkoutCalendarIcon(){

    const {setCalendarIsSelected} = useContext(LayoutContext);

    return(
        <button
            className='workoutCalendarIcon'
            aria-label="workout calendar button"
            onClick={()=>{setCalendarIsSelected(c=>!c)}}
        >
            <Icon icon="fluent:calendar-month-32-light"/>

        </button>
    );
}