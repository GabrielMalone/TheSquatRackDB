import './ProfileRoot.css';
import ProfileWindowManager from './ProfileWindowManager';

export default function ProfileRoot(){
    
    return (
        <div className='profileRoot'>
            <ProfileWindowManager />
            <div className='profileHeader'>Profile</div>
        </div>
    );
}