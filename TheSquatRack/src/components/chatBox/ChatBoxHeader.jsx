import './ChatBoxHeader.css';
import { Icon } from '@iconify/react';
import { socket } from '../../socket';
import { useEffect, useState } from 'react';

const defaultProf =  <Icon icon="iconamoon:profile-circle-thin" />;

export default function ChatBoxHeader({u}){

    const [isTyping, setIsTyping] = useState(false);

    useEffect(()=>{
        function handleTyping({ isTyping }){
            setIsTyping( isTyping );
        }
        socket.on("user_typing", handleTyping);
        return () => {
            socket.off("user_typing", handleTyping)
        };
    }, []);

    const onlineIndicator = u.isLoggedIn 
        ? "profilePicChatBoxHeader onlineProficHeader" 
        : "profilePicChatBoxHeader";

    let typingIndicator = isTyping ? 
        "userNameChatBoxHeader typing" : "userNameChatBoxHeader";

    return (
        <div className='chatBoxHeader'>
            <div className={onlineIndicator}>
                {u.profilePic ?? defaultProf}
            </div>
            <div className={typingIndicator}>
                {u.userName}
            </div>
        </div>
    );
}