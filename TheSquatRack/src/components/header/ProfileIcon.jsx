import './ProfileIcon.css';
import { LayoutContext } from '../../layoutContext';
import { AuthContext } from '../login/authContext';
import { useContext } from 'react';
import { Avatar } from '../profile/Avatar';

export default function ProfileIcon() {

    const c = useContext(LayoutContext);
    
    // const userName = userData.userName;
    function handleOnClick(){
        c.setProfileIsSelected(p=>!p);
    }
    return (
        <button 
            className='profileIcon' 
            onClick={handleOnClick}
            aria-label="profile icon"
        >   
            <Avatar src={c.profilePicUrl} size={48} online={true} isMe={true}/>
            {/* <div className='headerUsername'>{userName}</div> */}
        </button>
    );
}