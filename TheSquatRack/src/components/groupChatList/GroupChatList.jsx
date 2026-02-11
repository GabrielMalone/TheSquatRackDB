import './GroupChatList.css';
import GroupChatRow from './GroupChatRow';
import { useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '../login/authContext';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LayoutContext } from '../../layoutContext';
import { get } from '../../hooks/fetcher';

export default function GroupChatList() {
    
    const { userData } = useContext(AuthContext)
    const { isUserSearching, foundUsers, groupChatListSelected, setGroupChats } = useContext(LayoutContext);

    const { data: groupChatsData } = useSuspenseQuery({
        queryKey: ["getGroupChatIds", userData.idUser],
        queryFn: () => 
            get(`getGroupChatIds?idUser=${userData.idUser}`),
            
    });

    const gcsMap = useMemo(() => {
        const map = new Map();
        for (const gc of groupChatsData){
            map.set(gc.title, gc)
        }
        return map;
    }, [groupChatsData]);

    useEffect(()=>{
        setGroupChats(gcsMap);
    },[]);
    

    return (

        <div className='gcListRoot'>

            {
                isUserSearching && groupChatListSelected 
            ?
                foundUsers?.map(gc=><GroupChatRow key={gc.idConversation} gcData={gc}/>)
            :
                groupChatsData?.map(gc=><GroupChatRow key={gc.idConversation} gcData={gc}/>)
            }

        </div>
        
    );
}