import './WorkoutWindowManager.css';
import { Icon } from "@iconify/react";
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';
import { minimizer } from '../../../config/UI';

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
                <Icon icon={minimizer}/>
            </button>
        </div>
    );
}