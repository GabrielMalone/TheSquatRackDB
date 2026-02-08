import './GroupChatList.css';
import GroupChatRow from './GroupChatRow';
import { useContext } from 'react';
import { AuthContext } from '../login/authContext';
import { useSuspenseQuery } from '@tanstack/react-query';
import { get } from '../../hooks/fetcher';

export default function GroupChatList(){
    
    // okay here write a query to get all the group chats this user is a part of

    const { userData } = useContext(AuthContext)


    const { data: groupChatIds } = useSuspenseQuery({
        queryKey: ["getGroupChatIds", userData.idUser],
        queryFn: () => 
            get(`getGroupChatIds?idUser=${userData.idUser}`),
            
    });

    return (
        <>
        {groupChatIds?.length > 0 ? <div className='gcThreshold'>Groups</div> : null}
        <div className='gcListRoot'>
            {groupChatIds?.map(gc=><GroupChatRow key={gc.idConversation} gcData={gc}/>)}
        </div>
        </>
    );
}