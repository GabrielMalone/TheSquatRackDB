import { LayoutContext } from "./layoutContext";
import { AuthContext } from "./components/login/authContext";
import { useContext, useState } from "react";
import Layout from "./Layout";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import ProfileRoot from "./components/profile/ProfileRoot";
import ExerciseSelectionRoot from "./components/exerciseSelection/ExerciseSelectionRoot";
import CalendarRoot from "./components/calendar/CalendarRoot";
import WorkoutRoot from "./components/workout/WorkoutRoot";
import PrHistoryRoot from "./components/prHistory/PrHistoryRoot";
import ChatBox from "./components/chatBox/ChatBox";
import GroupChatBox from "./components/chatBox/GoupChatBox";

const BASE_URL = import.meta.env.VITE_API_BASE;

export default function LayoutProvider(){

    const { userData } = useContext(AuthContext);

    const [workoutIsPresent, setWorkoutIsPresent] = useState(false);
    const [chooseIsSelected, setChooseIsSelected] = useState(null);
    const [profileIsSelected, setProfileIsSelected] = useState(false);
    const [prHistoryIsSelected, setPrHistoryIsSelected] = useState(false);
    const [calendarIsSelected, setCalendarIsSelected] = useState(true);
    const [addExerciseRoute, setAddExerciseRoute] = useState("");
    const [chatIsSelected, SetChatIsSelected] = useState(false);
    const [groupChatIsSet, setGroupChatIsSet] = useState(false);
    const [userInChat, setUserInChat] = useState(null);
    const [chatIsDocked, setChatIsDocked] = useState(false);
    const [createGroupChatIsSelected, setCreateGroupChatIsSelected] = useState(false);
    const [addToGroupChatIsSelected, setAddToGroupChatIsSelected] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [groupConversationId, setGroupConversationId] = useState(null);
    const [groupChatIsDocked, setGroupChatIsDocked] = useState(false);
    const [groupChatListSelected, setGroupChatListSelected] = useState(false);

    const profilePicUrl = `${BASE_URL}/getProfilePic?idUser=${userData.idUser}`;

    const layout = {

        workoutIsPresent, 
        setWorkoutIsPresent,
        chooseIsSelected,
        setChooseIsSelected,
        profileIsSelected,
        setProfileIsSelected,
        prHistoryIsSelected,
        setPrHistoryIsSelected, 
        calendarIsSelected,
        setCalendarIsSelected,
        addExerciseRoute,
        setAddExerciseRoute,
        chatIsSelected,
        SetChatIsSelected,
        groupChatIsSet,
        setGroupChatIsSet,
        userInChat,
        setUserInChat,
        profilePicUrl,
        chatIsDocked,
        setChatIsDocked,
        groupChatIsDocked,
        setGroupChatIsDocked,
        createGroupChatIsSelected,
        setCreateGroupChatIsSelected, 
        conversationId,
        setConversationId,
        groupConversationId,
        setGroupConversationId,
        addToGroupChatIsSelected,
        setAddToGroupChatIsSelected,
        groupChatListSelected,
        setGroupChatListSelected
    }

    return(
        <LayoutContext.Provider value={layout}>
            <Layout 
                header={<Header />} 
                sidebar={<Sidebar />}
            >
                
            { chatIsSelected      ? <ChatBox />               : null }
            { groupChatIsSet      ? <GroupChatBox />          : null }
            { profileIsSelected   ? <ProfileRoot />           : null }
            { chooseIsSelected    ? <ExerciseSelectionRoot /> : null }
            { calendarIsSelected  ? <CalendarRoot />          : null }
            { workoutIsPresent    ? <WorkoutRoot />           : null }
            { prHistoryIsSelected ? <PrHistoryRoot />         : null }

            </Layout>
        </LayoutContext.Provider>
    );
}