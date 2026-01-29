import './ProfilePic.css';
import { useContext } from 'react';
import { LayoutContext } from '../../layoutContext.js';
import { Icon } from '@iconify/react';

export default function ProfilePic(){

    const {profilePicUrl} = useContext(LayoutContext);
    // const defaultProf =  <Icon icon="iconamoon:profile-circle-thin" />;

    function handleProfilePicChange(){

    }

    return (
        <button 
            className='profilePicRoot'
            onClick={handleProfilePicChange}
        >
            <img
                src={profilePicUrl}
                onError={(e) => {
                    if (e.currentTarget.dataset.fallback) return;
                    e.currentTarget.dataset.fallback = "1";
                    e.currentTarget.src = "/default-avatar.jpg";
                }}
            />
        </button>
    );
}