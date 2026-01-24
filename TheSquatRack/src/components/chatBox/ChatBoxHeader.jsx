import './ChatBoxHeader.css';
import { Icon } from '@iconify/react';

const defaultProf =  <Icon icon="iconamoon:profile-circle-thin" />;

export default function ChatBoxHeader({u}){

    const onlineIndicator = u.isLoggedIn 
        ? "profilePicChatBoxHeader onlineProficHeader" 
        : "profilePicChatBoxHeader";

    return (
        <div className='chatBoxHeader'>
            <div className={onlineIndicator}>
                {u.profilePic ?? defaultProf}
            </div>
            <div className='userNameChatBoxHeader'>
                {u.userName}
            </div>
        </div>
    );
}