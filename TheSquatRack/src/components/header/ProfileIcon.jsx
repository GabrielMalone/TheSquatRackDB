import './ProfileIcon.css';
import { Icon } from "@iconify/react";
import { LayoutContext } from '../../layoutContext';
import { AuthContext } from '../login/authContext';
import { useContext } from 'react';

export default function ProfileIcon(){

    const c = useContext(LayoutContext);
    // const { userData } = useContext(AuthContext);

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
            <Icon icon="iconamoon:profile-thin"/>
            {/* <div className='headerUsername'>{userName}</div> */}
        </button>
    );
}