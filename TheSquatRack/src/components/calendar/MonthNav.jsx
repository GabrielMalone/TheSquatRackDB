import './MonthNav.css';
import MonthBack from './MonthBack';
import MonthFoward from './MonthForward';
import YearMenu from './YearMenu';
import MonthMenu from './MonthMenu';
import CurDay from './curDay';
import { useContext } from 'react';
import { CalendarContext } from './calendarContext';


export default function MonthNav(){

    const calendar = useContext(CalendarContext);

    return(
        <div className='monthNav'>
            <MonthMenu nameOfMonth={calendar.monthLabel}/>
            <YearMenu />
            <CurDay goToToday={calendar.goToToday}/>
            <MonthBack prevMonth={calendar.prevMonth}/>
            <MonthFoward nextMonth={calendar.nextMonth} />
        </div>
    );
}