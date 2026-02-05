import './ChatBoxHeader.css';
import { Avatar } from '../profile/Avatar';
import { AuthContext } from '../login/authContext';
import { useContext } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE;

export default function ChatBoxHeader({u, usersInConvo}){

    const { userData } = useContext(AuthContext);

    const onlineIndicator = u.isLoggedIn 
        ? "profilePicChatBoxHeader onlineProficHeader" 
        : "profilePicChatBoxHeader";
    
    const onlineIndicatorName = u.isLoggedIn 
        ? "userNameChatBoxHeader userNameChatBoxHeaderOnline" 
        : "userNameChatBoxHeader";

    return(
        <div className='chatBoxHeader'>
            {usersInConvo.map((u)=>{
                return(
                    <div 
                        className={onlineIndicator}
                        key={u.idUser}
                    >
                        <Avatar 
                            key={u.idUser} 
                            src={`${BASE_URL}/getProfilePic?idUser=${u.idUser}`} 
                            size={80} 
                            online={u.isLoggedIn}
                        />
                        <div 
                            className={onlineIndicatorName}
                            style={u.idUser == userData.idUser ? 
                                {"color" : "var(--color-text-muted)"} : 
                                {"color" : "var(--color-text-muted)"}}
                         >
                            {u.userName}
                        </div>
                    </div>
                );
            })}
        </div>
    );    
}