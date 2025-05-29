//import React, { useRef, useEffect, useState } from "react";
import { useExpenseContext } from "@/hooks/useExpenseContext";
import { useCalendarContext } from "@/hooks/useCalendarContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useSpring, animated } from "@react-spring/web";
import { motion, AnimatePresence } from "motion/react";

const ExpenseCalendar = () => {
  const { isDataLoading } = useExpenseContext();

  /*const calendarRef = useRef<FullCalendar | null>(null);

  const [events, setEvents] = useState<{ title: string; start: string; amount: number; frequency: string | null; }[]>([]);
  const [chosenEvents, setChosenEvents] = useState<{ title: string; start: string; amount: number; frequency: string | null; }[]>([]);
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [monthlySpent, setMonthlySpent] = useState<number>(0);

  const [date, setDate] = React.useState<Date | undefined>(new Date())

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
      const formattedEvents = data.map((expense) => ({
          title: expense.name,
          start: expense.date,
          amount: expense.amount,
          frequency: expense.frequency,
        }));
      console.log(formattedEvents)
      const calculateDayExpenses = new Map();
      for (const event of formattedEvents) {
        if (calculateDayExpenses.has(event.start)) {
          calculateDayExpenses.set(event.start, calculateDayExpenses.get(event.start) + event.amount);
        } else {
          calculateDayExpenses.set(event.start, event.amount);
        }
      }
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
        (sum, event) => sum + event.amount,
        0,
      );
      setMonthlySpent(totalAmount);
    }
  }, [events, getCurrentMonth]);

  useEffect(() => {
    if (events.length > 0 && date instanceof Date) {
      const chosenEvents = events.filter((event) => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === date.toDateString();
      });
      setChosenEvents(chosenEvents);
    }
  }, [events, date]);*/
  const {
    calendarRef,
    events,
    chosenEvents,
    getCurrentMonth,
    monthAndYear,
    monthlySpent,
    date,
    setDate,
  } = useCalendarContext();

  const spentSpring = useSpring({
    from: { spent: 0 },
    to: { spent: monthlySpent },
    delay: 100,
    config: { mass: 1, tension: 500, friction: 40 },
  });

  return (
    <>
      {!isDataLoading ? (
        <>
          <Card className="mt-16 w-[200px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Monthly spent</CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="flex justify-row justify-between items-center space-y-0">
                <animated.div className="text-center text-2xl">
                  {spentSpring.spent.to(
                    (val) => `$${Math.floor(val).toLocaleString()}`,
                  )}
                </animated.div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
              </div>
              <p className="text-xs text-slate-400">
                {format(monthAndYear, "MMMM yyyy")}
              </p>
            </CardContent>
          </Card>
          <div className="w-7/12 ml-20 mb-20 dark:text-white">
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
                  <p
                    className={
                      (info.event.start as Date) > new Date()
                        ? "bg-red-500"
                        : "bg-teal-800"
                    }
                  >
                    {info.event.extendedProps.amount < 0
                      ? "+" + info.event.extendedProps.amount * -1
                      : "-" + info.event.extendedProps.amount}
                    $
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
          <div className="dark:text-white">
            <Calendar
              mode="single"
              selected={date}
              //eventData={events}
              onSelect={setDate}
              onMonthChange={() => setDate(undefined)}
              defaultMonth={new Date()}
              className="rounded-md border"
              footer={
                date ? `Selected: ${date.toLocaleDateString()}` : "Pick a day."
              }
            />
          </div>
          <div className="my-10 w-[300px] dark:text-white">
            <div className="text-sm mb-2">
              {date?.toLocaleString("en", { weekday: "long", day: "numeric" })}
            </div>
            <AnimatePresence>
              {chosenEvents.length > 0 &&
                chosenEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-row gap-1 text-xl">
                      <p>{event.title}</p>
                      <p>- {event.amount}$</p>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
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

export default ExpenseCalendar;
