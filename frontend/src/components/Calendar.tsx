import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { ExpenseInterface } from "../interfaces/interface";

const Calendar = ({data, isLoading} : {data: ExpenseInterface[], isLoading: boolean}) => {

    useEffect(() => {
        if (data && data.length > 0) {
            const formattedEvents = data.map((expense) => ({
                title: expense.name,
                date: expense.date,
            }));
            setEvents(formattedEvents);
        }
    },[data])

    const [events, setEvents] = useState<{title: string; date: string}[]>([]);

    return (
        <div className="w-1/3">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                height={500}
            >
            </FullCalendar>
        </div>
    )
}

export default Calendar;