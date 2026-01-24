import './PRhistoryIcon.css';
import { Icon } from '@iconify/react';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';

export default function PRhistoryIcon(){

    const {setPrHistoryIsSelected} = useContext(LayoutContext);

    return (
        <button className='prHistorySelect'
            aria-label='show pr history'
            onClick={()=>setPrHistoryIsSelected(p=>!p)}
        >
            <Icon icon="eva:bar-chart-outline"/>
        </button>
    );
}