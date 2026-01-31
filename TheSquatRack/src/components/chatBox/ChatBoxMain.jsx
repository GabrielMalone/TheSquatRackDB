import './ChatBoxMain.css';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get } from '../../hooks/fetcher.jsx';
import { post } from '../../hooks/fetcher.jsx';
import ChatBoxMessage from './ChatBoxMessage.jsx';
import { AuthContext } from '../login/authContext.jsx';
import { LayoutContext } from '../../layoutContext.js';
import { useRef, useEffect, useContext, useState } from 'react';
import { socket } from '../../socket.js';
import { Icon } from '@iconify/react';


export default function ChatBoxMain( { idConversation } ){
    // ---------------------------------------------------------------------------
    const queryClient = useQueryClient();
    const mainChatRef = useRef(null);
    const { userData } = useContext(AuthContext);
    const { userInChat } = useContext(LayoutContext); // get id of user to chat with from sidebar click
    const [isTyping, setIsTyping] = useState(false);
    const [idUserRecipient, setIdUserRecipient] = useState(null);
    const [idUserTyping, setIdUserTyping] = useState(null);
    const typingIcon = <Icon className='typingIconInChat' icon="eos-icons:typing"/>
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
        }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, isTyping]);
    // ---------------------------------------------------------------------------
    useEffect(()=>{                       
        function handleTyping({ idUserRecipient , idUserTyping, isTyping }){ 
            if (idUserRecipient === userData.idUser){ 
                setIsTyping( isTyping );
                setIdUserRecipient( idUserRecipient );
                setIdUserTyping( idUserTyping );
            }
        }   
        socket.on("user_typing_in_chat", handleTyping);
        return () => {
            socket.off("user_typing_in_chat", handleTyping)
        };
    }, [userData.idUser]);
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!idConversation || !userData?.idUser) return;
        socket.emit("join_conversation", {
            idConversation,
        });
        return () => {
            socket.emit("leave_conversation", {
                idConversation,
            });
        };
    }, [idConversation, userData.idUser]);

    
    // ---------------------------------------------------------------------------
    return (
        <div ref={mainChatRef} className='chatBoxMainRoot'>
            {messages.length > 0 ? messages.map((m, i)=>{
                return <ChatBoxMessage key={m.idMessage} msgData={m} total={messages.length} num={i}/>
            }) :<div className='emptyChat'>No chat history. Start a conersation!</div>}
            {   isTyping 
                && (userInChat.idUser === idUserTyping) 
                && (idUserRecipient == userData.idUser ) ? 

                <div className='typingIconInChat'>{typingIcon}</div> 

                : null
            } 
        </div>
    );
}