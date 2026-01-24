import './UserRow.css';
import { Icon } from "@iconify/react";
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';

const onlineIcon  = <Icon icon='ph:dot-outline' className='online'/>;
// const offlineIcon  = <Icon icon='ph:dot-outline' className='offline'/>;
const defaultProf = <Icon icon="iconamoon:profile-circle-thin" />;

export default function UserRow({user}){

    const { SetChatIsSelected, setUserInChat } = useContext(LayoutContext);

    function handleChat(){
        SetChatIsSelected(true);
        setUserInChat(user);
    }

    return (
        <button 
            className='userRow'
            aria-label={`chat button for user: ${user.userName}`}
            onClick={handleChat}
        >
            <div className='userProfilePicInList'>
                {user.profilePic ?? defaultProf}
            </div>
            <div className='userNameInList'>
                {user.userName}
            </div>
            <div className='userOnlineStatus'>
                { user.isLoggedIn ? onlineIcon : null }
            </div>
        </button>
    );
}