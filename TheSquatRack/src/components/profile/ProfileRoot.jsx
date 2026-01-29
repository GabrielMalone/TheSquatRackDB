import './ProfileRoot.css';
import ProfileWindowManager from './ProfileWindowManager';
import ProfilePic from './ProfilePic';
import { AuthContext } from '../login/authContext';
import { useContext } from 'react';

export default function ProfileRoot() {
    
    const { userData } = useContext(AuthContext);

    console.log("USER",userData.allUserData);

    const firstName = userData.allUserData.userFirst ?? 'First Name';
    const lastName = userData.allUserData.userLast ?? 'Last Name';

    return (
        <div className='profileRoot'>
            <ProfileWindowManager />
            <div className='profileHeader'>{userData.userName}</div>
            <div className='profileFullName'>
                <div className='firstName'>{firstName}</div>
                <div className='latName'>{lastName}</div>
            </div>
            <div className='aboutSection'>
                <ProfilePic />
            </div>
        </div>
    );
}