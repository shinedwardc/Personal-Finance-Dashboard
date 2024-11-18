import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { ExpenseInterface } from "../interfaces/interface";

const Calendar = ({data, isLoading} : {data: ExpenseInterface[], isLoading: boolean}) => {

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

    const [events, setEvents] = useState<{title: string; date: string}[]>([]);

    return (
        <div className="w-7/12 ml-20">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
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
    )
}

export default Calendar;