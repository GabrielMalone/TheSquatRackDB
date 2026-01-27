import './profileWindowManager.css';
import { Icon } from '@iconify/react';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';

export default function ProfileWindowManager(){

    const {setProfileIsSelected} = useContext(LayoutContext);

    return (
        <div className='profileWindowManager'>
            <button 
                className='minimizeProfile'
                onClick={()=>setProfileIsSelected(false)}
            >
                <Icon icon="mdi:minimize" />
            </button>
        </div>
    );
}