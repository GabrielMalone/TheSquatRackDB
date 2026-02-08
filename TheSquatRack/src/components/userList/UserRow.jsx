import './UserRow.css';
import { Icon } from "@iconify/react";
import { LayoutContext } from '../../layoutContext';
import { AuthContext } from '../login/authContext';
import { useContext, useEffect, useState } from 'react';
import { useSuspenseQuery, useMutation, useQueryClient  } from '@tanstack/react-query';
import { get } from '../../hooks/fetcher';
import { socket } from '../../socket';
import { Avatar } from '../profile/Avatar';
import { post } from '../../hooks/fetcher';

const BASE_URL = import.meta.env.VITE_API_BASE;

export default function UserRow({user, ourConversationId}){

    console.log("our conversation id: ", ourConversationId);
    // -----------------------------------------------------------------------------------
    const msgIcon = <Icon icon="ph:chat-thin"/> ;
    const addToChatIcon = <Icon icon="lets-icons:user-add-light"/> ;
    // const newWorkoutIcon = <Icon icon='stash:chart-trend-up' />
    const queryClient = useQueryClient();
    const { 

            SetChatIsSelected, 
            userInChat, 
            setUserInChat, 
            addToChatIsSelected, 
            createGroupChatIsSelected,
            setCreateGroupChatIsSelected,
            setGroupChatIsSet,
            setGroupConversationId,
            setAddToGroupChatIsSelected,
            addToGroupChatIsSelected,
            groupConversationId


        } = useContext(LayoutContext);

    const { userData } = useContext(AuthContext);
    const userOnline = user.isLoggedIn ? "userProfilePicInList online" : "userProfilePicInList";
    const [ isTyping, setIsTyping ] = useState(false);
    // -----------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------
    const { data: lastMsg } = useSuspenseQuery({
            queryKey: ["lastMessage", ourConversationId, userData.idUser],
            queryFn: () => 
                get(`getLastMsgInConversation?idConversation=${ourConversationId}&idUser=${userData.idUser}`),
            enabled: !!ourConversationId
    });
    // -----------------------------------------------------------------------------------
    const hasUnread =
        lastMsg &&  // does a msg exist
        lastMsg.idSender !== userData.idUser && // dont render unread for own outgoing msg
        (lastMsg.lastReadDate === null // if null then it's def unread
        ||
        new Date(lastMsg.lastReadDate) < new Date(lastMsg.msgDate));
    // -----------------------------------------------------------------------------------
    const createGroupConversationFromDM = useMutation({
        mutationFn: ()=>{
            const res =  post("createGroupConversationFromDM", {
                idCreator: userData.idUser,
                idUserB: userInChat.idUser,
                idUserNew: user.idUser     
            });
            return res;
        },
        enabled: addToChatIsSelected && !addToGroupChatIsSelected,
        onSuccess: (data)=> {
            setGroupConversationId(data)
            setCreateGroupChatIsSelected(false);
            // queryClient.invalidateQueries({
            //     queryKey: ["conversationId", userData?.idUser, user.idUser],
            // });
            queryClient.invalidateQueries({
                queryKey: ["usersInConvo"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["getGroupChatIds"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["convoTitle"],
                exact: false
            });
        }
    });
    // -----------------------------------------------------------------------------------
    const addUserToExistingGroup = useMutation({
        mutationFn: ()=>{
            const res =  post("addUserToExistingGroup", {
                idConversation: groupConversationId,
                idUser: user.idUser,   
            });
            return res;
        },
        onSuccess: ()=> {
            setAddToGroupChatIsSelected(false);
            // queryClient.invalidateQueries({
            //     queryKey: ["conversationId", userData?.idUser, user.idUser],
            // });
            queryClient.invalidateQueries({
                queryKey: ["usersInConvo"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["getGroupChatIds"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["convoTitle"],
                exact: false
            });
        }
    });
    // -----------------------------------------------------------------------------------
    function handleBeginChat() {
        if (addToGroupChatIsSelected){
            SetChatIsSelected(false);
            addUserToExistingGroup.mutate();
            setCreateGroupChatIsSelected(false);
            return;
        }
        if (createGroupChatIsSelected){
            createGroupConversationFromDM.mutate();
            setAddToGroupChatIsSelected(false);
            SetChatIsSelected(false);
            setGroupChatIsSet(true);
        }
        else {
            setGroupChatIsSet(false);
            SetChatIsSelected(true);
            setUserInChat(user);
        }
    }
    // ---------------------------------------------------------------------------
    useEffect(()=>{
        function handleTyping({ idUserTyping , isTyping }){ // userBeing typed to
            if (idUserTyping === user.idUser){
                setIsTyping( isTyping );
            }
        }
        socket.on("user_typing_user_list", handleTyping);
        return () => {
            socket.off("user_typing_user_list", handleTyping)
        };
    }, [isTyping, user.idUser]);
    // -----------------------------------------------------------------------------------
    return (
        <button 
            className='userRow'
            aria-label={`chat button for user: ${user.userName}`}
            onClick={handleBeginChat}
        >
            <div className={userOnline}>
                <Avatar 
                    src={user.hasProfilePic ? `${BASE_URL}getProfilePic?idUser=${user.idUser}` : null}
                    size={48}
                    online={user.isLoggedIn}
                />
            </div>
            <div className='userNameInList'>
                {user.userName}
            </div>
            <div className='newWorkoutPosted'>
                {/* {newWorkoutIcon} */}
            </div>
            <div className='addToGroupChat'>
                {addToGroupChatIsSelected || createGroupChatIsSelected ? addToChatIcon : null}
            </div>
            <div className="msgWaiting">
                {hasUnread && !isTyping ? msgIcon : null}
            </div>
        </button>
    );
}