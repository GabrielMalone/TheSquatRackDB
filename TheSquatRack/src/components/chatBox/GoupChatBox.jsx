import './GroupChatBox.css';
import ChatBoxWindowManager from './ChatBoxWindowManager';
import ChatBoxHeader from './ChatBoxHeader';
import ChatBoxMain from './ChatBoxMain';
import ChatBoxInput from './ChatBoxInput';
import { LayoutContext } from '../../layoutContext';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { get } from '../../hooks/fetcher.jsx';


export default function GroupChatBox(){

    // --------------------------------------------------------------------------------------------
    const { 
            groupChatIsDocked, 
            groupConversationId
        } = useContext(LayoutContext); // get id of user to chat with from sidebar click

    // --------------------------------------------------------------------------------------------

    const { data: usersInConvo } = useSuspenseQuery({
        queryKey: ["usersInConvo", groupConversationId],
        queryFn: () => 
            get(`getUsersInConversation?idConversation=${groupConversationId}`),
    });

    // --------------------------------------------------------------------------------------------
    return (
        <div className = {groupChatIsDocked ? 'groupChatBoxRoot groupChatdocked' : 'groupChatBoxRoot'}>
            <ChatBoxWindowManager isGroupChat={true}/>
            <ChatBoxHeader isGroupChat={true} u={null} usersInConvo={usersInConvo}/>
            <ChatBoxMain idConversation={groupConversationId} />
            <ChatBoxInput idConversation={groupConversationId} />
        </div>
    );
}
