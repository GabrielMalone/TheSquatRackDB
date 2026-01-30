import './ProfilePic.css';
import { useContext } from 'react';
import { LayoutContext } from '../../layoutContext.js';

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