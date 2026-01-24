import './ChatBoxInput.css';
import { AuthContext } from '../login/authContext';
import { useContext } from 'react';
import { post } from '../../hooks/fetcher.jsx';
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        sndMsg.mutate(msg);
    }

    return (
        <div className='chatBoxInputRoot'>
            <textarea 
                className='chatBoxInput' 
                onKeyDown={e=>{
                    if (e.key === 'Enter'){
                        e.preventDefault();
                        handleSendMsg(e.target.value);
                        e.target.value="";
                        
                    }
                }}
                onChange={()=>{
                }}
                placeholder='message...'
                maxLength={1000}
                spellCheck='false'
            />

        </div>
    );
}