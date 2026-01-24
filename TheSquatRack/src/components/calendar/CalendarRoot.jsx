import {useRef, useContext} from 'react'; 
import './CalendarRoot.css';
import Month from './Month';
import MonthNav from './MonthNav';
import { LayoutContext } from '../../layoutContext';
import { useScrollIntoView } from '../../hooks/useScrollIntoView';


export default function CalendarRoot(){
    
    const rootRef = useRef(null);
    const {workoutIsPresent} = useContext(LayoutContext);

    useScrollIntoView(rootRef, !workoutIsPresent, "start");

    return (
            <div className='calendarRoot' ref={rootRef}>
                <MonthNav />
                <Month />
            </div>
    )
}
