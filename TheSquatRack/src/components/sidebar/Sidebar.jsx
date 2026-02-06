import './Sidebar.css';
import SideBarHeader from './SidebarHeader';
import UserList from '../userList/UserList';
import GroupChatList from '../groupChatList/GroupChatList';

export default function Sidebar(){
    return (
        <div className='sidebar'>
            <SideBarHeader />
            <UserList />
            <GroupChatList />
        </div>
    );
}