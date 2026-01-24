import './WorkoutWindowManager.css';
import { Icon } from "@iconify/react";
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';

export default function WorkoutWindowManager(){

     const { setWorkoutIsPresent } = useContext(LayoutContext);

    function handleClose(){
        setWorkoutIsPresent(false);
    }

    return (
        <div className='workoutWindowManager'>
            <button className='closeButton'
                    onClick={handleClose}
                    aria-label="workout close button"
            >
                <Icon icon="mdi:minimize"/>
            </button>
        </div>
    );
}