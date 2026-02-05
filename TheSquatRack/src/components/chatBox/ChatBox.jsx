import './ChatBox.css';
import ChatBoxWindowManager from './ChatBoxWindowManager';
import ChatBoxHeader from './ChatBoxHeader';
import ChatBoxMain from './ChatBoxMain';
import ChatBoxInput from './ChatBoxInput';
import { LayoutContext } from '../../layoutContext';
import { AuthContext } from '../login/authContext';
import { UsersOnlineContext } from '../userList/UserOnlineContext';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import { get } from '../../hooks/fetcher.jsx';
import { post } from '../../hooks/fetcher.jsx';

export default function ChatBox(){

    // TO DO --
    // write a query that gets all the users in this current conversation , we already get the conversation id
    // so can do it right after that
    //
    // map the users in the header instead of hardcoding them
    //


    // --------------------------------------------------------------------------------------------
    const { userInChat, chatIsDocked } = useContext(LayoutContext); // get id of user to chat with from sidebar click
    const { userData } = useContext(AuthContext);  // currently logged in user
    const { users } = useContext(UsersOnlineContext); // get all the users' data that's dynamically updated via websocket
    const u = users.filter(user=>user.idUser === userInChat.idUser)[0]; // match the above to the current user to chat with
    const queryClient = useQueryClient();
    // --------------------------------------------------------------------------------------------
    const { data: conversation } = useSuspenseQuery({
        queryKey: ["conversationId", userData.idUser, u.idUser],
        queryFn: () => 
            get(`getConversationId?idUser1=${userData.idUser}&idUser2=${u.idUser}`),
    });
    // --------------------------------------------------------------------------------------------
    const createConversation = useMutation({
        mutationFn: ()=>{
            return post("createConversation", {
                idSender: userData.idUser,
                idRecipient: u.idUser     
            });
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({
                queryKey: ["conversationId", userData.idUser, u.idUser],
            });
        }
    });
    // --------------------------------------------------------------------------------------------
    useEffect(() => {
        if (conversation === null) {
            createConversation.mutate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation]);

    // --------------------------------------------------------------------------------------------
    return (
        <div className = {chatIsDocked ? 'chatBoxRoot docked' : 'chatBoxRoot'}>
            <ChatBoxWindowManager />
            <ChatBoxHeader u={u} />
            <ChatBoxMain idConversation={conversation?.idConversation} />
            <ChatBoxInput idConversation={conversation?.idConversation} />
        </div>
    );
}
