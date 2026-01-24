import { UsersOnlineContext } from './UserOnlineContext';
import { get } from '../../hooks/fetcher.jsx'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { socket } from '../../socket.js';
import { useEffect } from 'react';


export function OnlineContextProvider({ children }) {

    const queryClient = useQueryClient();
   
    const {data : users } = useSuspenseQuery({
        queryKey: ["userList"],
        queryFn: () => get(`getLifters`),
    });

    useEffect(() => {
        
        function onPresenceChange() {
            console.log('someone logged in/out');
            queryClient.invalidateQueries({ queryKey: ["userList"] });
        }

        function onMsgSent(data){
            console.log('someone sent a message!', data.idConversation);
            queryClient.invalidateQueries({ queryKey: ["conversationMessages", data.idConversation] });
        }
        
        socket.on("presence_changed", onPresenceChange);
        socket.on("msg_sent", onMsgSent);

        return () => {
            socket.off("presence_changed", onPresenceChange);
            socket.off("msg_sent", onMsgSent)
        };

    }, [queryClient]);


    return (
        <UsersOnlineContext.Provider value={{ users }}>
            {children}
        </UsersOnlineContext.Provider>
    );
}
