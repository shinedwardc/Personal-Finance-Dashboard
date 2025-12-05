import { useRef, useEffect, useState, useMemo } from "react";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useSpring, animated } from "@react-spring/web";
import { categoryConfig } from "@/constants/categoryConfig";

const ExpenseCalendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);

  const [events, setEvents] = useState<
    { title: string; start: string; amount: number; category: string }[]
  >([]);
  const [eventsByDate, setEventsByDate] = useState<
    Map<string, { title: string; category: string; amount: number }[]>
  >(new Map());
  const today = useMemo(() => new Date(), []);
  const [monthAndYear, setMonthAndYear] = useState<Date>(today);
  const [monthlySpent, setMonthlySpent] = useState<number>(0);

  const [selectedItem, setSelectedItem] = useState<string>("All");

  const { data, isLoading: isDataLoading } = useMonthlyExpenses(monthAndYear);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const current = calendarApi.getDate();
      if (
        current.getFullYear() !== monthAndYear.getFullYear() ||
        current.getMonth() !== monthAndYear.getMonth()
      ) {
        calendarApi.gotoDate(monthAndYear);
      }
    }
  }, [monthAndYear]);

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("data: ", data);
      const totalAmount = data.reduce((sum, event) => {
        if (event.amount >= 0) {
          return sum + event.amount;
        }
        return sum;
      }, 0);
      setMonthlySpent(totalAmount);
      const formattedTransactions = data.map((expense) => ({
        title: expense.name,
        start: expense.date,
        amount: expense.amount,
        category: expense.category,
      }));
      setEvents(formattedTransactions);
      const eventsByDate = new Map<
        string,
        { title: string; category: string; amount: number }[]
      >();
      formattedTransactions.map((event) => {
        if (eventsByDate.has(event.start)) {
          eventsByDate.get(event.start)?.push({
            title: event.title,
            category: event.category,
            amount: event.amount,
          });
        } else {
          eventsByDate.set(event.start, [
            {
              title: event.title,
              category: event.category,
              amount: event.amount,
            },
          ]);
        }
      });
      setEventsByDate(eventsByDate);
      console.log("eventsByDate: ", eventsByDate);
    } else {
      setMonthlySpent(0);
      setEvents([]);
    }
  }, [monthAndYear, data]);

  /*useEffect(() => {
    console.log("events: ", events);
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
  }, [events, getCurrentMonth]);*/

  /*const {
    calendarRef,
    events,
    chosenEvents,
    getCurrentMonth,
    monthAndYear,
    monthlySpent,
    date,
    setDate,
  } = useCalendarContext();*/

  const handleDateChange = (arg: { start: Date }) => {
    const newDate = new Date(arg.start);
    setMonthAndYear(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
  };

  const spentSpring = useSpring({
    from: { spent: 0 },
    to: { spent: monthlySpent },
    delay: 100,
    config: { mass: 1, tension: 500, friction: 40 },
  });

  return (
    <>
      <Card className="mt-12 mb-6 bg-gradient-to-br from-emerald-600/30 via-slate-800/40 to-indigo-700/20 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Monthly spent</CardTitle>
        </CardHeader>
        <CardContent>
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
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-4">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialDate={monthAndYear}
          initialView="dayGridMonth"
          showNonCurrentDates={false}
          fixedWeekCount={false}
          ref={calendarRef}
          datesSet={handleDateChange}
          events={events}
          headerToolbar={{
            start: "prev,next",
            center: "title",
            end: "today",
          }}
          buttonText={{ today: "Today" }}
          eventContent={(info) => {
            const category = info.event.extendedProps.category;
            const amount = info.event.extendedProps.amount;

            const config = categoryConfig[category];
            const label = config.label.replace(/ /g, "-").toLowerCase();

            return (
              <div
                className="flex items-center gap-1 px-1 py-[1px] rounded-md cursor-pointer
                              hover:scale-[1.03] transition-transform"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `var(--color-${label})` }}
                />

                <span className="text-[11px] font-medium truncate w-full">
                  {info.event.title}
                </span>

                <span className="text-[10px] text-neutral-100 px-1 rounded-sm ml-auto">
                  {amount > 0 ? "-" + amount : "+" + Math.abs(amount)}$
                </span>
              </div>
            );
          }}
          height={750}
        ></FullCalendar>
        <div className="flex flex-row justify-items-start gap-1">
          <p>* </p>
          <div className="inline-block bg-red-500 text-red-500">*****</div>
          <p>: Upcoming recurring bill</p>
        </div>
      </div>
      {/*<div className="dark:text-white">
        <Calendar
          mode="single"
          selected={date}
          //eventData={events}
          onSelect={setDate}
          onMonthChange={() => setDate(undefined)}
          defaultMonth={monthAndYear}
          className="rounded-md border"
          footer={
            date ? `Selected: ${date.toLocaleDateString()}` : "Pick a day."
          }
        />
      </div>*/}
      <section className="w-1/2 overflow-y-auto max-h-[500px]">
        <div className="self-start inline-flex">
          <Select defaultValue={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger className="border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select expenses</SelectLabel>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-10 w-1/2 dark:text-white">
          {[...eventsByDate].map(([date, events]) => {
            const filtered =
              selectedItem === "All"
                ? events
                : events.filter((event) =>
                    selectedItem === "Expense"
                      ? event.amount > 0
                      : event.amount < 0,
                  );
            if (filtered.length === 0) return null;
            return (
              <div key={date} className="mb-4">
                <div className="font-semibold">
                  {new Date(date).toLocaleString("en", {
                    weekday: "long",
                    day: "numeric",
                  })}
                </div>
                <ul>
                  {events.map((event, idx) => (
                    <li key={idx}>
                      {event.title} - {event.category}{" "}
                      {
                        categoryConfig[
                          event.category as keyof typeof categoryConfig
                        ]?.icon
                      }{" "}
                      - ${event.amount}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ExpenseCalendar;
