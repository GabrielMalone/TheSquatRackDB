import './MonthMenu.css';
import {useState, useContext, useRef} from 'react';
import { CalendarContext } from './calendarContext';
import { useClickOutside } from '../../hooks/useClickOutside';
import { monthsMap } from './monthsMap';

export default function MonthMenu({nameOfMonth}){

    const calendar = useContext(CalendarContext);
    const pickerRef = useRef(null);
    const [showMonthMenu, setShowMonthMenu] = useState(false);

    useClickOutside(pickerRef, ()=>setShowMonthMenu(false), showMonthMenu);

    function toggleMonthMenu(){
        setShowMonthMenu(m => !m);
    }

    function selectNewMonth(newMonth){
        calendar.setMonth(newMonth);
        toggleMonthMenu();
    }

    return (
        <div className='monthPicker' ref={pickerRef}>

            <button 
                onClick={toggleMonthMenu}
                aria-label={`${nameOfMonth} selected`}
            >
                {nameOfMonth}  
            </button>

            {showMonthMenu && (
                <div className="monthMenu">
                    {monthsMap.map(month=>{
                        return( <button key={month.monthIndex} 
                                onClick={()=>{selectNewMonth(month.monthIndex)}} 
                                className='monthMenu'
                            >
                            {month.monthName}
                            </button>
                        );
                    })}
                </div>
            )}
            
        </div>
    );
}