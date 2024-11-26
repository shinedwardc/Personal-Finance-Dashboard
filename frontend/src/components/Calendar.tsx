import { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ExpenseInterface } from "../interfaces/interface";

const Calendar = ({
  data,
  isLoading,
}: {
  data: ExpenseInterface[];
  isLoading: boolean;
}) => {
  const calendarRef = useRef(null);

  const [events, setEvents] = useState<{ title: string; date: string }[]>([]);
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [monthlySpent, setMonthlySpent] = useState<number>(0);

  const getCurrentMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentMonth = calendarApi.getDate().getMonth();
      const currentYear = calendarApi.getDate().getFullYear();
      setMonth(currentMonth + 1);
      setYear(currentYear);
      console.log(currentMonth + 1);
      console.log(currentYear);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const formattedEvents = data.flatMap((expense) => {
        const events = [];
        events.push({
          title: expense.name,
          start: expense.date,
          amount: expense.amount,
          frequency: expense.frequency,
          upcoming: false,
        });
        if (expense.frequency && expense.period) {
          const startDate = new Date(expense.date);
          const increment = expense.frequency === "monthly" ? 1 : 12;

          for (let i = 1; i <= expense.period; i++){
            const recurringDate = new Date(startDate);
            recurringDate.setMonth(startDate.getMonth() + i * increment);
            events.push({
              title: expense.name,
              start: recurringDate.toISOString().split("T")[0],
              amount: expense.amount,
              frequency: expense.frequency,
              upcoming: true,
            })
          }
        }
        return events;
      });
      setEvents(formattedEvents);
    }
  }, [data]);

  useEffect(() => {
    if (events.length > 0 && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentMonth = calendarApi.getDate().getMonth();
      const currentYear = calendarApi.getDate().getFullYear();
      const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getMonth() === currentMonth &&
          eventDate.getFullYear() === currentYear
        );
      });
      const totalAmount = filteredEvents.reduce(
        (sum, event) => sum + parseInt(event.amount),
        0,
      );
      setMonthlySpent(totalAmount);
    }
  }, [events, getCurrentMonth]);

  return (
    <>
      {!isLoading ? (
        <>
          <div className="w-7/12 ml-20">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              showNonCurrentDates={false}
              fixedWeekCount={false}
              ref={calendarRef}
              datesSet={() => getCurrentMonth()}
              events={events}
              eventContent={(info) => (
                <div className="text-center">
                  <h1 className="bg-green-600 overflow-hidden text-ellipsis">
                    {info.event.title}
                  </h1>
                  <p className={info.event.extendedProps.upcoming ? "bg-red-500" : "bg-teal-800"}>
                    {info.event.extendedProps.amount}$
                    {console.log(info.event.extendedProps)}
                  </p>
                </div>
              )}
              height={750}
            ></FullCalendar>
            <div className="flex flex-row justify-items-start gap-1">
              <p>* </p>
              <div className="inline-block bg-red-500 text-red-500">*****</div>
              <p>: Upcoming recurring bill</p>            
            </div>            
          </div>
          <div className="stats shadow">
            <div className="stat place-items-center">
              <div className="stat-title">Monthly spent</div>
              <div className="stat-value">{monthlySpent}$</div>
              <div className="stat-desc">
                {month}/{year}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <p>Calendar rendering...</p>
        </div>
      )}
    </>
  );
};

export default Calendar;
