import { LayoutContext } from "./layoutContext";
import { useState } from "react";
import Layout from "./Layout";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import ProfileRoot from "./components/profile/ProfileRoot";
import ExerciseSelectionRoot from "./components/exerciseSelection/ExerciseSelectionRoot";
import CalendarRoot from "./components/calendar/CalendarRoot";
import WorkoutRoot from "./components/workout/WorkoutRoot";
import PrHistoryRoot from "./components/prHistory/PrHistoryRoot";
import ChatBox from "./components/chatBox/ChatBox";

export default function LayoutProvider(){

    const [workoutIsPresent, setWorkoutIsPresent] = useState(false);
    const [chooseIsSelected, setChooseIsSelected] = useState(null);
    const [profileIsSelected, setProfileIsSelected] = useState(false);
    const [prHistoryIsSelected, setPrHistoryIsSelected] = useState(false);
    const [calendarIsSelected, setCalendarIsSelected] = useState(true);
    const [addExerciseRoute, setAddExerciseRoute] = useState("");
    const [chatIsSelected, SetChatIsSelected] = useState(false);
    const [userInChat, setUserInChat] = useState(null);

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
        userInChat,
        setUserInChat
    }

    return(
        <LayoutContext.Provider value={layout}>
            <Layout 
                header={<Header />} 
                sidebar={<Sidebar />}
            >

            { profileIsSelected   ? <ProfileRoot />           : null }
            { chatIsSelected      ? <ChatBox />               : null }
            { chooseIsSelected    ? <ExerciseSelectionRoot /> : null }
            { calendarIsSelected  ? <CalendarRoot />          : null }
            { workoutIsPresent    ? <WorkoutRoot />           : null }
            { prHistoryIsSelected ? <PrHistoryRoot />         : null }

            </Layout>
        </LayoutContext.Provider>
    );
}