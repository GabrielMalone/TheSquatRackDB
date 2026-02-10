import './SidebarSearch.css'
import { useContext, useMemo, useState } from 'react';
import { UsersOnlineContext } from '../userList/UserOnlineContext';

export default function SidebarSearch(){
    // -------------------------------------------------------------
    const [searchQuery, setSearchQuery] = useState("");

    const { users } = useContext(UsersOnlineContext)
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

        if (q.length < 1) {
          
             return;
        }

        const resultsMap = new Map();
        const results = [];

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

        console.log("results! ", results)
     
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
                    setSearchQuery(e.target.value)
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