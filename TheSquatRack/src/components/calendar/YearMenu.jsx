import {useState} from 'react';
import { useContext } from 'react';
import { CalendarContext } from './calendarContext';
import './YearMenu.css';

export default function YearMenu(){

    const calendar = useContext(CalendarContext);
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(calendar.year);

    function commitYear(){
        const y = Number(value);
        if (!Number.isNaN(y) && y <= 9999 && y >= 1000) {
            calendar.setYear(y);
        }
        setEditing(false);
    }

    function handleKey(e){
        if (e.key === "Enter") commitYear();
        if (e.key === "Escape") setEditing(false);
    }

    return (
        <div className='yearPicker'>
            { editing ? (
            <input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                onBlur={commitYear}
                onKeyDown={handleKey}
                autoFocus 
                className='yearInput'
                /> )
            : (
            <button 
                className='yearButton' 
                onClick={()=>setEditing(true)}
                aria-label={`${calendar.year} selected`}
            >
                {calendar.year}
            </button> )}
            
        </div>
    );
}