import './ChatBoxWindowManager.css';
import { Icon } from '@iconify/react';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';
import { minimizer, dockIcon } from '../../../config/UI';

export default function ChatBoxWindowManager({isGroupChat}){

    const { 
        
            SetChatIsSelected, 
            setChatIsDocked, 
            setCreateGroupChatIsSelected, 
            setAddToGroupChatIsSelected,
            setGroupChatIsSet,
            setGroupChatIsDocked

         } = useContext(LayoutContext);
         
    return (
        <div className='exerciseSelectionWindowManager'>
            <button 
                className='addToChat'
                onClick={()=>{
                    if (isGroupChat){
                        console.log("ever here?");
                        setAddToGroupChatIsSelected(a=>!a);
                    } else {
                        console.log("setCreateGroupChatIsSelected?");
                        setCreateGroupChatIsSelected(a=>!a);
                    }
                }}
            >
                <Icon icon="lets-icons:user-add-light"/>
            </button>
            <button 
                className='minimize'
                onClick={()=>{
                    if (isGroupChat){
                        setGroupChatIsSet(g=>!g);
                    } else {
                        SetChatIsSelected(c=>!c);
                        setCreateGroupChatIsSelected(false);
                    }
                }}
            >
                <Icon icon={minimizer} />
            </button>
            <button 
                className='dockChatButton'
                onClick={()=>{
                    if (isGroupChat){
                        setGroupChatIsDocked(d=>!d);
                    } else {
                        setChatIsDocked(d=>!d);
                    }
        
                }}
            >
                <Icon icon={dockIcon} />
            </button>
        </div>
    );
}