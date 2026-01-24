import './App.css';
import useCalendar from './hooks/useCalendar.js';
import LayoutProvider from './LayoutProvider.jsx';
import { CalendarContext } from './components/calendar/calendarContext.js';
import { WorkoutDataContext } from './components/workout/workoutDataContext.js';
import { DayContext } from './components/calendar/DayContext';
import { OnlineContextProvider } from './components/userList/OnlineContext';
import { useState } from 'react';


export default function App() {
  
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  return (
    <OnlineContextProvider>
      <CalendarContext.Provider value={useCalendar()}>
        <DayContext.Provider value={{ selectedDayId, setSelectedDayId }}>
          <WorkoutDataContext.Provider value={{ selectedWorkoutId, setSelectedWorkoutId }}>
            <LayoutProvider />
          </WorkoutDataContext.Provider>
        </DayContext.Provider>
      </CalendarContext.Provider>
    </OnlineContextProvider>
  );
}
