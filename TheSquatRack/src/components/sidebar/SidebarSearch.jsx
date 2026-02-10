import './SidebarSearch.css'
import { useContext, useMemo } from 'react';
import { UsersOnlineContext } from '../userList/UserOnlineContext'
import { LayoutContext } from '../../layoutContext';

export default function SidebarSearch(){
    // -------------------------------------------------------------

    // place the searchresults from handleasarch users in the layout context too
    // then when we search we create the userlist from the search results

    const { users } = useContext(UsersOnlineContext)
    // need the groups too

    const { setIsUserSearching, setFoundUsers, groupChatListSelected } = useContext(LayoutContext);

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
            const resultsMap = new Map();

            for (const [key, user] of userMap.entries()) {
                if (key.toLowerCase().includes(q)) {
                    resultsMap.set(user.userName, user);
                }
            }
            // eslint-disable-next-line no-unused-vars
            for (const [key, lift] of resultsMap.entries()) {
                results.push(lift);
            }
            results.sort((a, b) =>{
                return a.exerciseID - b.exerciseID;
            });

        } else {
            // groups search
            const resultsMap = new Map();

            for (const [key, user] of userMap.entries()) {
                if (key.toLowerCase().includes(q)) {
                    resultsMap.set(user.userName, user);
                }
            }
            // eslint-disable-next-line no-unused-vars
            for (const [key, lift] of resultsMap.entries()) {
                results.push(lift);
            }
            results.sort((a, b) =>{
                return a.exerciseID - b.exerciseID;
            });            
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