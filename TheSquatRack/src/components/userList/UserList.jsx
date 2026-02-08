import './UserList.css';
import UserRow from './UserRow';
import { UsersOnlineContext } from './UserOnlineContext';
import { useContext } from 'react';
import { AuthContext } from '../login/authContext';
import { get } from '../../hooks/fetcher';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function UserList(){
    // in the future this will need to be based off of userId and that user's friends
    // but can use all users for search function too
    const { userData } = useContext(AuthContext)
    const { users } = useContext(UsersOnlineContext);

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
    return (
        <div className='userListRoot'>
            {u.map((user)=>{
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