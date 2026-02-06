import './ChatBoxHeader.css';
import { Avatar } from '../profile/Avatar';
import { AuthContext } from '../login/authContext';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';
import { get } from '../../hooks/fetcher';
import { useSuspenseQuery } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_BASE;

export default function ChatBoxHeader({isGroupChat, u, usersInConvo}){

    const { groupConversationId } = useContext(LayoutContext);

    const { data: convoTitle } = useSuspenseQuery({
        queryKey: ["convoTitle", groupConversationId],
        queryFn: () => 
            get(`getConvoTitle?idConversation=${groupConversationId}`),
            enabled: isGroupChat && !!groupConversationId
    });

    const onlineIndicator = u?.isLoggedIn 
        ? "profilePicChatBoxHeader onlineProficHeader" 
        : "profilePicChatBoxHeader";
    

    return(
        <>
        {isGroupChat ? 
        <div className='chatTitle'>{convoTitle?.Title}</div> 
        : null}
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
                            className="userNameChatBoxHeader"
                            style={
                                u.isLoggedIn ? 
                                {"color" : "var(--color-text-bright)"} : 
                                {"color" : "var(--color-text-muted)"}}
                         >
                            {u.userName}
                        </div>
                    </div>
                );
            })}
        </div>
        </>
    );    
}