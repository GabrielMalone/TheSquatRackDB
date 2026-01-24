import './UserList.css';
import UserRow from './UserRow';
import { UsersOnlineContext } from './UserOnlineContext';
import { useContext } from 'react';
import { AuthContext } from '../login/authContext';

export default function UserList(){
    // in the future this will need to be based off of userId and that user's friends
    // but can use all users for search function too
    const { userData } = useContext(AuthContext)
    const { users } = useContext(UsersOnlineContext);

    users.sort((a, b) => b.isLoggedIn - a.isLoggedIn);

    const u = users.filter(user=>{
        if (user.idUser != userData.idUser) return true;
        return false;
    });

    return (
        <div className='userListRoot'>
            {u.map(user=><UserRow key={user.idUser} user={user}/>)}
        </div>
    );
}