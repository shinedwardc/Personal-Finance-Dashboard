import { useRef, useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { ExpenseInterface } from "../interfaces/interface";

const Calendar = ({data, isLoading} : {data: ExpenseInterface[], isLoading: boolean}) => {
    
    const calendarRef = useRef(null);


    const [events, setEvents] = useState<{title: string; date: string}[]>([]);
    const [month, setMonth] = useState<number>(0);
    const [year, setYear] = useState<number>(0);
    const [monthlySpent, setMonthlySpent] = useState<number>(0);

    const getCurrentMonth = () => {
        if(calendarRef.current){
            const calendarApi = calendarRef.current.getApi();
            const currentMonth = calendarApi.getDate().getMonth();
            const currentYear = calendarApi.getDate().getFullYear();;
            setMonth(currentMonth+1);
            setYear(currentYear);
            console.log(currentMonth+1);
            console.log(currentYear);
        }
    }


    useEffect(() => {
        if (data && data.length > 0) {
            const formattedEvents = data.map((expense) => ({
                title: expense.name,
                start: expense.date,
                amount: expense.amount,
            }));
            setEvents(formattedEvents);
        }
    },[data])

    useEffect(() => {
        if(events.length > 0 && calendarRef.current){
            const calendarApi = calendarRef.current.getApi();
            const currentMonth = calendarApi.getDate().getMonth();
            const currentYear = calendarApi.getDate().getFullYear();
            const filteredEvents = events.filter((event) => {
                const eventDate = new Date(event.start);
                return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
            });

            const totalAmount = filteredEvents.reduce((sum,event) => sum + parseInt(event.amount), 0);
            setMonthlySpent(totalAmount);
        }
    },[events,getCurrentMonth])


    return (
        <>
        <div className="w-7/12 ml-20">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                ref={calendarRef}
                datesSet={() => getCurrentMonth()}
                events={events}
                eventContent={(info) => (
                    <div className="text-center">
                        <h1 className="bg-green-600 overflow-hidden text-ellipsis">{info.event.title}</h1>
                        <p className="bg-teal-800">{info.event.extendedProps.amount}$</p>
                    </div>
                )}
                height={750}
            >
            </FullCalendar>
        </div>
        <div className="stats shadow">
            <div className="stat">
                <div className="stat-title">Total Spent</div>
                <div className="stat-value">{monthlySpent}$</div>
                <div className="stat-desc">{month}/{year}</div>
            </div>
        </div>
        </>
    )
}

export default Calendar;