import './MonthChange.css';
import { Icon } from "@iconify/react";

export default function MonthFoward({nextMonth}){

    return (
        <button 
            className='monthChange nextMonth' 
            onClick={nextMonth}
            aria-label="Next Month"
        >
            <Icon icon="lucide:chevron-right"/>
        </button>
    );
}