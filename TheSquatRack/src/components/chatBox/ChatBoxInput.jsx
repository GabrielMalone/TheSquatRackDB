import './ChatBoxInput.css';
import { AuthContext } from '../login/authContext';
import { useContext, useRef, useState } from 'react';
import { post } from '../../hooks/fetcher.jsx';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { socket } from '../../socket.js';
import { Icon } from '@iconify/react';
import { LayoutContext } from '../../layoutContext.js';

export default function ChatBoxInput({idConversation}) {

    const { userData } = useContext(AuthContext); // currently logged in user
    const { userInChat }    = useContext(LayoutContext); // get id of user to chat with from sidebar click
    const queryClient = useQueryClient();

    const ref = useRef();

    const [isTyping, setIsTyping] = useState(false);

    const sndMsg = useMutation({
        mutationFn: (msg) => {
            return post("sendMsg", {
                idConversation, 
                idSender : userData.idUser,
                msg
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["conversationMessages"],
                exact: false
            });
        }
    });

    function handleSendMsg(){
        if (!ref.current)return;
        if (ref.current.value === "") return;
        sndMsg.mutate(ref.current.value);
        ref.current.value = "";
    }

    function notTyping(){
        socket.emit("typingInChat", {
            idConversation,
            idUserRecipient : userInChat.idUser, // to whom are we sending the typing emit
            isTyping: false
        });
        socket.emit("typingInChatUserList", {
            idConversation,
            idUserTyping : userData.idUser, // who is typing
            idUserRecipient : userInChat.idUser, // to whom are we sending the typing emit
            isTyping: false
        });
        if (ref.current){
            setIsTyping(false);
        }
    }

    function amTyping(){
        socket.emit("typingInChat", {
            idConversation,
            idUserRecipient : userInChat.idUser, // to whom are we sending the typing emit
            isTyping: true
        });
        socket.emit("typingInChatUserList", {
            idConversation,
            idUserTyping : userData.idUser, // who is typing
            idUserRecipient : userInChat.idUser, // to whom are we sending the typing emit
            isTyping: true
        });
        if (ref.current){
            setIsTyping(true);
        }
    }

    const buttonClass = isTyping ? "sendChatText highlighted" : "sendChatText";

    return (
        <div className='chatBoxInputRoot'>
            <textarea 
                ref={ref}
                className='chatBoxInput' 
                onKeyDown={e => {
                    if (e.key === 'Enter'){
                        e.preventDefault();
                        notTyping();
                        handleSendMsg();
                    }
                }}
                onChange={amTyping}
                placeholder='message...'
                maxLength={1000}
                spellCheck='false'
                onBlur={notTyping}
                onKeyUp={e => {
                    if(e.target.value === ""){
                        notTyping();
                    }
                }}
            />
            <button 
                className={buttonClass}
                aria-label='send chat text'
                onClick={handleSendMsg}
            >
                <Icon icon='streamline:mail-send-email-message'/>
            </button>
        </div>
    );
}