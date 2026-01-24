import './MonthChange.css';
import { Icon } from "@iconify/react";

export default function MonthBack({prevMonth}){

    return (
        <button 
            className='monthChange' 
            onClick={prevMonth}
            aria-label="Previous Month"
        >
            <Icon icon="lucide:chevron-left"/>
        </button>
    );
}