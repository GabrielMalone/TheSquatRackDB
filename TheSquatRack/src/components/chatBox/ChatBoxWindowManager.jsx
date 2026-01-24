import './ChatBoxWindowManager.css';
import { Icon } from '@iconify/react';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';

export default function ChatBoxWindowManager(){
   
    const {SetChatIsSelected} = useContext(LayoutContext);

    return (
        <div className='exerciseSelectionWindowManager'>
            <button 
                className='minimize'
                onClick={()=>SetChatIsSelected(c=>!c)}
            >
                <Icon icon="mdi:minimize" />
            </button>
        </div>
    );
}