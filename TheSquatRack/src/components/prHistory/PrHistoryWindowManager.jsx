import './PrHistoryWindowManager.css';
import { Icon } from "@iconify/react";
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';
import { minimizer } from '../../../config/UI';

export default function PrHistoryWindowManager(){

     const { setPrHistoryIsSelected } = useContext(LayoutContext);

    function handleClose(){
        setPrHistoryIsSelected(false);
    }

    return (
        <div className='prHistoryWindowManager'>

            <button className='closeButton'
                    onClick={handleClose}
                    aria-label="pr history window close button"
            >
                <Icon icon={minimizer}/>
            </button>
        </div>
    );
}