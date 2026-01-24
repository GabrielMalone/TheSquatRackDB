import './CurDay.css';
import { Icon } from "@iconify/react";

export default function CurDay({goToToday}){
    return(
        <button 
            className='curDay' 
            onClick={goToToday}
            aria-label="current day"
        >
            <Icon icon="lucide:circle"/>
        </button>
    );
}
