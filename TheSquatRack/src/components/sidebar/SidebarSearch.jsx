import './SidebarSearch.css'
import { useContext, useMemo } from 'react';
import { UsersOnlineContext } from '../userList/UserOnlineContext'
import { LayoutContext } from '../../layoutContext';

export default function SidebarSearch(){
    // -------------------------------------------------------------

    // place the searchresults from handleasarch users in the layout context too
    // then when we search we create the userlist from the search results

    const { users } = useContext(UsersOnlineContext)
    const { setIsUserSearching, setFoundUsers, groupChatListSelected, groupChats } = useContext(LayoutContext);

    // -------------------------------------------------------------
    // map them for search and memoize 
    const userMap = useMemo(() => {
        const map = new Map();
        for (const user of users){
            map.set(user.userName, user)
        }
        return map;
    }, [users]);
    // -------------------------------------------------------------
    function handleSearchUsers(q) {

        q = q.toLowerCase();

        let results = []

        if (q.length < 1) {
          
             return;
        }
        if (! groupChatListSelected){
            
            // users search
            for (const [key, user] of userMap.entries()) {
                if (key.toLowerCase().includes(q)) {
                    results.push(user);
                }
            }

        } else {

            // groups search
            for (const [key, gc] of groupChats.entries()) {
                if (key.toLowerCase().includes(q)) {
                    results.push(gc);
                }
            }

        }

        setFoundUsers(results);
     
    }
    // -------------------------------------------------------------
    return (
        <div className='sidebarSearchRoot'>
            <textarea 
                className='sidebarSearchBox' 
                onKeyDown={e => {
                    if (e.key === 'Enter'){
                        e.preventDefault();
                    }
                }}
                onChange={(e)=>{
                    if (e.target.value===""){
                        setIsUserSearching(false);
                        return;
                    }
                    setIsUserSearching(true);
                    handleSearchUsers(e.target.value);
                }}
                placeholder='search'
                maxLength={1000}
                spellCheck='false'
                onBlur={()=>{}}
                onKeyUp={e => {
                    if(e.target.value === ""){
                        console.log();
                    }
                }}
            />
        </div>
    );
}