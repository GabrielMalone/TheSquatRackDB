import './ProfilePic.css';
import { useContext } from 'react';
import { LayoutContext } from '../../layoutContext.js';
import { Avatar } from './Avatar.jsx';

export default function ProfilePic(){

    const {profilePicUrl} = useContext(LayoutContext);

    function handleProfilePicChange(){

    }

    return (
        <button 
            className='profilePicRoot'
            onClick={handleProfilePicChange}
        >
            <img
                src={profilePicUrl}
            />
        </button>
    );
}