import './PrHistoryWindowManager.css';
import { Icon } from "@iconify/react";
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';

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
                <Icon icon="mdi:minimize"/>
            </button>
        </div>
    );
}