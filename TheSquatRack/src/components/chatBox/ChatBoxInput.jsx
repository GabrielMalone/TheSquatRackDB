import './ChatBoxInput.css';
import { AuthContext } from '../login/authContext';
import { useContext } from 'react';
import { post } from '../../hooks/fetcher.jsx';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { socket } from '../../socket.js';

export default function ChatBoxInput({idConversation}) {

    const { userData } = useContext(AuthContext); // currently logged in user

    const queryClient = useQueryClient();

    const sndMsg = useMutation({
        mutationFn: (msg)=> {
            return post("sendMsg", {
                idConversation, 
                idSender : userData.idUser,
                msg
            });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: ["conversationMessages"],
                exact: false
            });
        }
    });

    function handleSendMsg(msg){
        if (msg === "") return;
        sndMsg.mutate(msg);
    }

    function notTyping(){
        socket.emit("typing", {
            idConversation,
            isTyping: false
        });
    }

    function amTyping(){
        socket.emit("typing", {
            idConversation,
            isTyping: true
        });
    }

    return (
        <div className='chatBoxInputRoot'>
            <textarea 
                className='chatBoxInput' 
                onKeyDown={e=>{
                    if (e.key === 'Enter'){
                        e.preventDefault();
                        notTyping();
                        handleSendMsg(e.target.value);
                        e.target.value="";
                    }
                }}
                onChange={amTyping}
                placeholder='message...'
                maxLength={1000}
                spellCheck='false'
                onBlur={notTyping}
                onKeyUp={e=>{
                    if(e.target.value === ""){
                        notTyping();
                    }
                }}
            />
        </div>
    );
}