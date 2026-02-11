import './UserList.css';
import UserRow from './UserRow';
import { UsersOnlineContext } from './UserOnlineContext';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../login/authContext';
import { get } from '../../hooks/fetcher';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LayoutContext } from '../../layoutContext';

export default function UserList(){
    // in the future this will need to be based off of userId and that user's friends
    // but can use all users for search function too
    const { userData } = useContext(AuthContext)
    const { users } = useContext(UsersOnlineContext);
    const { isUserSearching, foundUsers } = useContext(LayoutContext);

    // -------------------------------------------------------------

    const { data: conversations } = useSuspenseQuery({
        queryKey: ["conversationIds", userData.idUser],
        queryFn: () => 
            get(`getConversationIdsForUser?idUser=${userData.idUser}`),
    });

    users.sort((a, b) => b.isLoggedIn - a.isLoggedIn);

    const u = users.filter(user=>{
        if (user.idUser != userData.idUser) return true;
        return false;
    });

    foundUsers?.sort((a, b) => b.isLoggedIn - a.isLoggedIn);
    const fu = foundUsers?.filter(user=>{
        if (user.idUser != userData.idUser) return true;
        return false;
    });

    useEffect(()=>{
        // rerender on change for these?
    }, [isUserSearching, foundUsers]);

    return (    
        <div className='userListRoot'>
            
            { 
            isUserSearching ?

            fu.map((user)=>{
                return (
                    <UserRow 
                        key={user.idUser} 
                        user={user} 
                        ourConversationId={
                            conversations.find(c => c.otherUserId === user.idUser)?.idConversation
                        }
                    />
                );})
            
            :

            u.map((user)=>{
                return (
                    <UserRow 
                        key={user.idUser} 
                        user={user} 
                        ourConversationId={
                            conversations.find(c => c.otherUserId === user.idUser)?.idConversation
                        }
                    />
                );})
            }

        </div>
    );
}