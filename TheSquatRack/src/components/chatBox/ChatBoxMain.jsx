import './ChatBoxMain.css';
import { useSuspenseQuery } from '@tanstack/react-query';
import { get } from '../../hooks/fetcher.jsx';
import ChatBoxMessage from './ChatBoxMessage.jsx';
import { useRef, useEffect } from 'react';

export default function ChatBoxMain( { idConversation } ){

    const mainChatRef = useRef(null);

    const { data: messages } = useSuspenseQuery({
        queryKey: ["conversationMessages", idConversation],
        queryFn: () => 
            get(`getConversationMessages?idConversation=${idConversation}`),
            enabled: !!idConversation,
    });

    useEffect(() => {
        const el = mainChatRef.current;
        if (!el) return;
        setTimeout(() => {
            el.scrollTop = el.scrollHeight;
        }, 10);
    }, [messages]);



    return (
        <div ref={mainChatRef} className='chatBoxMainRoot'>
            {messages.length > 0 ? messages.map((m, i)=>{
                return <ChatBoxMessage key={m.idMessage} msgData={m} total={messages.length} num={i}/>
            }) :<div className='emptyChat'>no chat history</div>}
        </div>
    );
}