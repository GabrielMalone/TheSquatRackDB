import './ChatBoxHeader.css';
import { Avatar } from '../profile/Avatar';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';
import { get } from '../../hooks/fetcher';
import { post } from '../../hooks/fetcher';
import { useState, useEffect } from 'react';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_BASE;

export default function ChatBoxHeader({isGroupChat, u, usersInConvo}){
    //-----------------------------------------------------------------------------------
    const queryClient = useQueryClient();
    //-----------------------------------------------------------------------------------
    const { groupConversationId } = useContext(LayoutContext);
    //-----------------------------------------------------------------------------------
    const { data: convoTitle } = useSuspenseQuery({
        queryKey: ["convoTitle", groupConversationId],
        queryFn: () => 
            get(`getConvoTitle?idConversation=${groupConversationId}`),
            enabled: isGroupChat
    });
    //-----------------------------------------------------------------------------------
    const onlineIndicator = u?.isLoggedIn 
        ? "profilePicChatBoxHeader onlineProficHeader" 
        : "profilePicChatBoxHeader";
    //-----------------------------------------------------------------------------------
    const [draftTitle, setDraftTitle] = useState(convoTitle?.Title ?? "New Group Chat");
    //-----------------------------------------------------------------------------------
    const updateTitle = useMutation({
        mutationFn: () => {
            return post("changeGroupChatTitle", {
                idConversation: groupConversationId,
                title : draftTitle,
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(
                ["convoTitle", groupConversationId]
            );   
        },
    });
    //-----------------------------------------------------------------------------------
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setDraftTitle(convoTitle?.Title ?? "New Group Chat");
    }, [groupConversationId, convoTitle?.Title]);
    //-----------------------------------------------------------------------------------
    return(
        <>
        {isGroupChat ? 
        <input 
            className='chatTitle'
            type='text'
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={()=>{
                if (draftTitle.trim()){
                    updateTitle.mutate();
                }
            }}
            onKeyUp={(e)=>{
                if (e.key === "Enter" && draftTitle.trim()) {
                    updateTitle.mutate();
                }
            }}
        >

        </input> 
        : null}
        <div className='chatBoxHeader'>
            {usersInConvo.map((u)=>{
                return(
                    <div 
                        className={onlineIndicator}
                        key={u.idUser}
                    >
                        <Avatar 
                            src={u.hasProfilePic ? `${BASE_URL}/getProfilePic?idUser=${u.idUser}` : null} 
                            size={80} 
                            online={u.isLoggedIn}
                            
                        />
                        <div 
                            className="userNameChatBoxHeader"
                            style={
                                u.isLoggedIn ? 
                                {"color" : "var(--color-text-bright)"} : 
                                {"color" : "var(--color-text-muted)"}}
                         >
                            {u.userName}
                        </div>
                    </div>
                );
            })}
        </div>
        </>
    );    
}