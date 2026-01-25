import './ChatBoxMain.css';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get } from '../../hooks/fetcher.jsx';
import { post } from '../../hooks/fetcher.jsx';
import ChatBoxMessage from './ChatBoxMessage.jsx';
import { AuthContext } from '../login/authContext.jsx';
import { useRef, useEffect, useContext } from 'react';

export default function ChatBoxMain( { idConversation } ){
    // ---------------------------------------------------------------------------
    const queryClient = useQueryClient();
    const mainChatRef = useRef(null);
    const { userData } = useContext(AuthContext);
    // ---------------------------------------------------------------------------
    const { data: messages } = useSuspenseQuery({
        queryKey: ["conversationMessages", idConversation],
        queryFn: () => 
            get(`getConversationMessages?idConversation=${idConversation}`),
    });
    // ---------------------------------------------------------------------------
    const updateLastRead = useMutation({
        mutationFn: () => {
            return post("updateLastReadAt", {
                idConversation,
                idUser : userData.idUser,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["lastMessage", idConversation, userData.idUser],
            });
        },
    });
    // ---------------------------------------------------------------------------
    // scroll to bottom every time a new message comes in and update last read
    // accoringly
    // ---------------------------------------------------------------------------
    useEffect(() => {
        const el = mainChatRef.current;
        if (!el) return;
        setTimeout(() => {
            el.scrollTop = el.scrollHeight;
            updateLastRead.mutate();
        }, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);
    // ---------------------------------------------------------------------------
    return (
        <div ref={mainChatRef} className='chatBoxMainRoot'>
            {messages.length > 0 ? messages.map((m, i)=>{
                return <ChatBoxMessage key={m.idMessage} msgData={m} total={messages.length} num={i}/>
            }) :<div className='emptyChat'>no chat history</div>}
        </div>
    );
}