import './Sidebar.css';
import SideBarHeader from './SidebarHeader';
import UserList from '../userList/UserList';
import GroupChatList from '../groupChatList/GroupChatList';
import { LayoutContext } from '../../layoutContext';
import { useContext } from 'react';

export default function Sidebar(){

    const { groupChatListSelected } = useContext(LayoutContext);

    return (
        <div className='sidebar'>
            <SideBarHeader />
            { 
            groupChatListSelected ?
            <GroupChatList /> : 
            <UserList /> 
            }
        </div>
    );
}