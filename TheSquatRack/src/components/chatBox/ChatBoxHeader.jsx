import './ChatBoxHeader.css';
import { Avatar } from '../profile/Avatar';
import { AuthContext } from '../login/authContext';
import { useContext } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE;

export default function ChatBoxHeader({u}){

    const { userData } = useContext(AuthContext);

    const onlineIndicator = u.isLoggedIn 
        ? "profilePicChatBoxHeader onlineProficHeader" 
        : "profilePicChatBoxHeader";
    
    const onlineIndicatorName = u.isLoggedIn 
        ? "userNameChatBoxHeader userNameChatBoxHeaderOnline" 
        : "userNameChatBoxHeader";

    // this will need to be changed into a for loop 

    return (
        <div className='chatBoxHeader'>

            <div 
                className={onlineIndicator}
                style={{gridColumn : 5}}
            >
                <Avatar key={u.idUser} src={`${BASE_URL}/getProfilePic?idUser=${u.idUser}`} size={80} online={u.isLoggedIn}/>
            </div>
            <div 
                className={onlineIndicatorName}
                style={{gridColumn : 5}}
            >
                {u.userName}
            </div>

            <div 
                className={onlineIndicator}
                style={{gridColumn : 6}}
            >
                <Avatar key={userData.idUser} src={`${BASE_URL}/getProfilePic?idUser=${userData.idUser}`} size={80} online={true}/>
            </div>
            <div 
                className={onlineIndicatorName}
                style={{gridColumn : 6}}
            >
                {userData.userName}
            </div>

        </div>
    );
}