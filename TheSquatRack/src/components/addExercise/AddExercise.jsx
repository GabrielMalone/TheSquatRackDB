import './AddExercise.css';
import { Icon } from '@iconify/react';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';

export default function AddExercise({route}){

    const {setChooseIsSelected, setAddExerciseRoute} = useContext(LayoutContext);

    return (
        <div className='addExerciseContainer'>

            <button 
                onClick={()=>{
                    setChooseIsSelected(c=>!c)
                    setAddExerciseRoute(route);
                }}
            >
                <Icon icon="ic:baseline-add-box" />
            </button>

            <div className='addExerciseText'>
                <p>add exercise</p>
            </div>

        </div>
    );
}