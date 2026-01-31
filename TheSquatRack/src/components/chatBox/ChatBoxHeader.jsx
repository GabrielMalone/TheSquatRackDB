import './ChatBoxHeader.css';
import { Avatar } from '../profile/Avatar';
const BASE_URL = import.meta.env.VITE_API_BASE;

export default function ChatBoxHeader({u}){

    const onlineIndicator = u.isLoggedIn 
        ? "profilePicChatBoxHeader onlineProficHeader" 
        : "profilePicChatBoxHeader";
    
    const onlineIndicatorName = u.isLoggedIn 
        ? "userNameChatBoxHeader userNameChatBoxHeaderOnline" 
        : "userNameChatBoxHeader";

    const src = `${BASE_URL}/getProfilePic?idUser=${u.idUser}`;

    return (
        <div className='chatBoxHeader'>
            <div className={onlineIndicator}>
               <Avatar key={u.idUser} src={src} size={80} online={u.isLoggedIn}/>
            </div>
            <div className={onlineIndicatorName}>
                {u.userName}
            </div>
        </div>
    );
}