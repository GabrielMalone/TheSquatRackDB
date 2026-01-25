import { UsersOnlineContext } from './UserOnlineContext';
import { get } from '../../hooks/fetcher.jsx'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { socket } from '../../socket.js';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../login/authContext.jsx';


export function OnlineContextProvider({ children }) {
    // ---------------------------------------------------------------------------
    const { userData } = useContext(AuthContext);
    const queryClient = useQueryClient();
    // ---------------------------------------------------------------------------
    const {data : users } = useSuspenseQuery({
        queryKey: ["userList"],
        queryFn: () => get(`getLifters`),
    });
    // ---------------------------------------------------------------------------
    useEffect(() => {
        
        function onPresenceChange() {
            queryClient.invalidateQueries({ queryKey: ["userList"] });
        }

        function onMsgSent(data){
            console.log('msg sent!', data);
            queryClient.invalidateQueries({ queryKey: ["conversationMessages", data.idConversation] });
            queryClient.invalidateQueries({ queryKey: ["lastMessage", data.idConversation, userData.idUser ] });
        }
        
        socket.on("presence_changed", onPresenceChange);
        socket.on("msg_sent", onMsgSent);

        return () => {
            socket.off("presence_changed", onPresenceChange);
            socket.off("msg_sent", onMsgSent)
        };

    }, [queryClient, userData.idUser]);

    // ---------------------------------------------------------------------------
    return (
        <UsersOnlineContext.Provider value={{ users }}>
            {children}
        </UsersOnlineContext.Provider>
    );
}
