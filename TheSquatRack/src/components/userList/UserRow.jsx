import './UserRow.css';
import { Icon } from "@iconify/react";
import { LayoutContext } from '../../layoutContext';
import { AuthContext } from '../login/authContext';
import { useContext, useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { get } from '../../hooks/fetcher';
import { socket } from '../../socket';


export default function UserRow({user}){

    const defaultProf = <Icon icon="iconamoon:profile-circle-thin" />;
    const typingIcon = <Icon className='typingIconInChat' icon="eos-icons:typing"/>
    const msgIcon = <Icon icon="bytesize:message"/> 
    const newWorkoutIcon = <Icon icon='stash:chart-trend-up' />
    // -----------------------------------------------------------------------------------
    const { SetChatIsSelected, setUserInChat } = useContext(LayoutContext);
    const { userData } = useContext(AuthContext);
    const userOnline = user.isLoggedIn ? "userProfilePicInList online" : "userProfilePicInList";
    const [ isTyping, setIsTyping ] = useState(false);
    // -----------------------------------------------------------------------------------
    const { data: conversation } = useSuspenseQuery({
        queryKey: ["conversationId", userData.idUser, user.idUser],
        queryFn: () => 
            get(`getConversationId?idUser1=${userData.idUser}&idUser2=${user.idUser}`),
    });
    // -----------------------------------------------------------------------------------
    const { data: lastMsg } = useSuspenseQuery({
            queryKey: ["lastMessage", conversation?.idConversation, userData.idUser],
            queryFn: () => 
                get(`getLastMsgInConversation?idConversation=${conversation?.idConversation}&idUser=${userData.idUser}`),
            enabled: !!conversation?.idConversation
    });
    // -----------------------------------------------------------------------------------
    const hasUnread =
        lastMsg &&  // does a msg exist
        lastMsg.idSender !== userData.idUser && // dont render unread for own outgoing msg
        (lastMsg.lastReadDate === null // if null then it's def unread
        ||
        new Date(lastMsg.lastReadDate) < new Date(lastMsg.msgDate));
    // -----------------------------------------------------------------------------------
    function handleBeginChat() {
        SetChatIsSelected(true);
        setUserInChat(user);
    }
    // ---------------------------------------------------------------------------
    useEffect(()=>{
        function handleTyping({ idUserTyping , isTyping }){ // userBeing typed to
            console.log(`sender id ${idUserTyping} user.id ${user.idUser}`);
            if (idUserTyping === user.idUser){
                setIsTyping( isTyping );
            }
        }
        socket.on("user_typing_user_list", handleTyping);
        return () => {
            socket.off("user_typing_user_list", handleTyping)
        };
    }, [isTyping, user.idUser]);
    // -----------------------------------------------------------------------------------
    return (
        <button 
            className='userRow'
            aria-label={`chat button for user: ${user.userName}`}
            onClick={handleBeginChat}
        >
            <div className={userOnline}>
                {user.profilePic ? user.profilePic : defaultProf}
            </div>
            <div className='userNameInList'>
                {user.userName}
            </div>
            <div className='newWorkoutPosted'>
                {/* {newWorkoutIcon} */}
            </div>
            <div className="msgWaiting fade">
                {hasUnread && !isTyping ? msgIcon : null}
                {isTyping ? typingIcon : null}
            </div>
        </button>
    );
}