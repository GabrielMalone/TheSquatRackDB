import './ExerciseSelectionWindowManager.css';
import { Icon } from '@iconify/react';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';
import { minimizer } from '../../../config/UI';

export default function ExerciseSelectionWindowManager(){

    const {setChooseIsSelected} = useContext(LayoutContext);

    return (
        <div className='exerciseSelectionWindowManager'>
            <button 
                className='minimize'
                onClick={()=>setChooseIsSelected(c=>!c)}
            >
                <Icon icon={minimizer} />
            </button>
        </div>
    );
}