import './ChatBoxWindowManager.css';
import { Icon } from '@iconify/react';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';
import { minimizer, dockIcon } from '../../../config/UI';

export default function ChatBoxWindowManager(){

    const { SetChatIsSelected, setChatIsDocked } = useContext(LayoutContext);

    return (
        <div className='exerciseSelectionWindowManager'>
            <button 
                className='addToChat'
            >
                <Icon icon="lets-icons:user-add-light"/>
            </button>
            <button 
                className='minimize'
                onClick={()=>SetChatIsSelected(c=>!c)}
            >
                <Icon icon={minimizer} />
            </button>
            <button 
                className='dockChatButton'
                onClick={()=>setChatIsDocked(d=>!d)}
            >
                <Icon icon={dockIcon} />
            </button>
        </div>
    );
}