import './UserRow.css';
import { Icon } from "@iconify/react";
import { LayoutContext } from '../../layoutContext';
import { AuthContext } from '../login/authContext';
import { useContext } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { get } from '../../hooks/fetcher';


const defaultProf = <Icon icon="iconamoon:profile-circle-thin" />;
const msgIcon = <Icon icon="bytesize:message"/>

export default function UserRow({user}){
    // -----------------------------------------------------------------------------------
    const { SetChatIsSelected, setUserInChat } = useContext(LayoutContext);
    const { userData } = useContext(AuthContext);
    const userOnline = user.isLoggedIn ? "userProfilePicInList online" : "userProfilePicInList";
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
        lastMsg && 
        (lastMsg.lastReadDate === null
        ||
        new Date(lastMsg.lastReadDate) < new Date(lastMsg.msgDate));
    // -----------------------------------------------------------------------------------
    function handleBeginChat() {
        SetChatIsSelected(true);
        setUserInChat(user);
    }
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
            <div className="msgWaiting fade">
                {hasUnread ? msgIcon : null}
            </div>
        </button>
    );
}