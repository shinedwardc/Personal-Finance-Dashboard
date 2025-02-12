import { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ExpenseInterface } from "../interfaces/interface";
import { useSpring, animated } from "@react-spring/web";

const Calendar = ({
  data,
  isLoading,
}: {
  data: ExpenseInterface[];
  isLoading: boolean;
}) => {
  const calendarRef = useRef(null);

  const [events, setEvents] = useState<{ title: string; start: string; amount: number; frequency: string | null; }[]>([]);
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

  const spentSpring = useSpring({
    from: { spent: 0 },
    to: { spent: monthlySpent },
    delay: 100,
    config: {mass: 1, tension: 500, friction: 45}
  })

  useEffect(() => {
    if (data && data.length > 0) {
      const formattedEvents = data.map((expense) => ({
          title: expense.name,
          start: expense.date,
          amount: expense.amount,
          frequency: expense.frequency,
        }));
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
          eventDate.getFullYear() === currentYear &&
          event.amount >= 0
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
          <div className="stats bg-primary shadow mt-16">
            <div className="stat place-items-center text-black">
              <div className="stat-title text-black">Monthly spent</div>
              <animated.div className="stat-value">{spentSpring.spent.to(val => `$${Math.floor(val).toLocaleString()}`)}</animated.div>
              <div className="stat-desc text-black">
                {month}/{year}
              </div>
            </div>
          </div>
          <div className="w-7/12 ml-20 mb-20">
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
                  <p className={info.event.start > new Date() ? "bg-red-500" : "bg-teal-800"}>
                    {info.event.extendedProps.amount < 0 ? "+" + info.event.extendedProps.amount * -1 : "-" + info.event.extendedProps.amount}$
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
