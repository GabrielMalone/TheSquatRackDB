import './Sidebar.css';
import SideBarHeader from './SidebarHeader';
import UserList from '../userList/UserList';

export default function Sidebar(){
    return (
        <div className='sidebar'>
            <SideBarHeader />
            <UserList />
        </div>
    );
}