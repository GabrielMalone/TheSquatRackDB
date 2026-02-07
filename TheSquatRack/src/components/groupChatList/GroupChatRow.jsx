import './GroupChatRow.css';
import { LayoutContext } from '../../layoutContext';
import { get } from '../../hooks/fetcher';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Avatar } from '../profile/Avatar';
import { useContext } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE;

export default function GroupChatRow({gcData}){
    // -----------------------------------------------------------------------------------
   
    // -----------------------------------------------------------------------------------
    // console.log('gcdata:', gcData);
    const { setGroupConversationId, setGroupChatIsSet, SetChatIsSelected } = useContext(LayoutContext);
    // what do we want -- we want title of gc
    // then all the user avatars in the gc
    const { data: usersInConvo } = useSuspenseQuery({
        queryKey: ["usersInConvo", gcData.idConversation],
        queryFn: () => 
            get(`getUsersInConversation?idConversation=${gcData.idConversation}`),
    });
    
    console.log("users in this gc: ", usersInConvo);

    return (
        <button 
            className='groupChatRowRoot'
            onClick={()=>{
                SetChatIsSelected(false);
                setGroupConversationId(gcData.idConversation);
                setGroupChatIsSet(true);
            }}  
        >
            <div className='gcRowTitle'>{gcData.title}</div> 
                <div className='gcRowUserGrid'>
                {usersInConvo.map((u)=>{
                    return(
                        <div 
                            className={u?.isLoggedIn 
                            ? "profilePicChatBoxHeader onlineProficHeader" 
                            : "profilePicChatBoxHeader"}
                            key={u.idUser}
                        >
                            <Avatar 
                                key={u.idUser} 
                                src={`${BASE_URL}/getProfilePic?idUser=${u.idUser}`} 
                                size={40} 
                                online={u.isLoggedIn}
                                
                            />
                        </div>
                    );
                })}
            </div>
        </button>
    );
}