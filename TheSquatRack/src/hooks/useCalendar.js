import { useState, useMemo } from "react";
import dayjs from "dayjs";

export default function useCalendar() {
    
    const [currentDate, setCurrentDate] = useState(dayjs());
    const today = dayjs();

    const calendar = useMemo(() => {

        const year = currentDate.year();
        const month = currentDate.month();
        const monthLabel = currentDate.format("MMMM");
        const daysInMonth = currentDate.daysInMonth();
        const startWeekday = currentDate.startOf("month").day();
        const isCurrentMonth = currentDate.year() === today.year() && currentDate.month() === today.month();
        const days = [];
        const prevMonth = currentDate.subtract(1, "month");
        const daysInPrevMonth = prevMonth.daysInMonth();
        const nextMonth = currentDate.add(1, "month");
        const endOfMonthDay = currentDate.endOf("month").day();

        // leading prev month days
        const startPrevDay = daysInPrevMonth - startWeekday + 1;
        for (let day = startPrevDay; day <= daysInPrevMonth; day++) {
            days.push({
                        id: `${prevMonth.year()}-${String(prevMonth.month() + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`,
                        day,
                        month: prevMonth.month(),
                        year: prevMonth.year(),
                        inCurrentMonth: false,
                        isToday: false,
            });
        }
        // actual days in cur month
        for (let d = 1; d <= daysInMonth; d++) {
            days.push({
                        id : `${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`,
                        day: d, 
                        month: month,
                        year: year,
                        inCurrentMonth: true,
                        isToday: isCurrentMonth && d === today.date(),
                    });
        }
        // days in next month
        let i = 1;
        for (let d = endOfMonthDay; d < 6 ; d ++){
            let day = i ++ ;
            days.push({
                        id : `${nextMonth.year()}-${String(nextMonth.month() + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`,
                        day : day,
                        month: nextMonth.month(),
                        year : nextMonth.year(),
                        inCurrentMonth : false,
                        isToday:false,
                });
        }

        return {
            year,
            month,
            monthLabel,
            days,
            today: isCurrentMonth ? today.date() : null
        };
    }, [currentDate, today]);

    function nextMonth() {
        setCurrentDate(d => d.add(1, "month"));
    }

    function prevMonth() {
        setCurrentDate(d => d.subtract(1, "month"));
    }

    function goToToday() {
        setCurrentDate(dayjs());
    }

    function setMonth(monthIndex) {
        setCurrentDate(d => d.set("month", monthIndex));
    }

    function setYear(year) {
        setCurrentDate(d => d.set("year", year));
    }

    return {
        ...calendar,
        nextMonth,
        prevMonth,
        goToToday,
        setMonth,
        setYear
    };
}