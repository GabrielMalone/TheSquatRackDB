import './ListToggle.css'
import { Icon } from '@iconify/react';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';
import SidebarSearch from './SidebarSearch';

export default function ListToggle() {

    const { setGroupChatListSelected } = useContext(LayoutContext);    

    return (
        <div className='listToggleRoot'>
            <div className='listIcons'>
                <button 
                    className='userListButton'
                    onClick={()=>{
                        setGroupChatListSelected(false);
                    }}
                >
                    <Icon 
                        id="dmsIcon" 
                        icon="lucide:user"
                    />
                </button>
                <button 
                    className='userListButton'
                    onClick={()=>{
                        setGroupChatListSelected(true);
                    }}                    
                >
                    <Icon 
                        id="groupChatIcon" 
                        icon="streamline-sharp:user-collaborate-group"
                    />
                </button>
            </div>
            <SidebarSearch />
        </div>
    );
}