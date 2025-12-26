import { useRef, useEffect, useState, useMemo } from "react";
import { useMonthlyTransactions } from "@/hooks/useMonthlyTransactions";
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
import { expenseCategoryConfig } from "@/constants/expenseCategoryConfig";
import { incomeCategoryConfig } from "@/constants/incomeCategoryConfig";
//import { systemConfig } from "@/constants/expenseCategoryConfig";

const ExpenseCalendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);

  const [events, setEvents] = useState<
    { title: string; start: string; amount: number; category: string }[]
  >([]);
  const [eventsByDate, setEventsByDate] = useState<
    Map<string, { title: string; category: string; type: "Expense" | "Income"; amount: number }[]>
  >(new Map());
  const today = useMemo(() => new Date(), []);
  const [monthAndYear, setMonthAndYear] = useState<Date>(today);
  const [monthlySpent, setMonthlySpent] = useState<number>(0);

  const [selectedItem, setSelectedItem] = useState<string>("All");

  const { data, isLoading: isDataLoading } = useMonthlyTransactions(monthAndYear);

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
    if (data) {
      console.log("data: ", data);
      const totalAmount = data.reduce((sum, event) => {
        if (event.type === "Expense") {
          return sum + event.amount;
        }
        return sum;
      }, 0);
      setMonthlySpent(totalAmount);
      const formattedTransactions = data.map((transaction) => ({
        title: transaction.name,
        start: transaction.date,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
      }));
      setEvents(formattedTransactions);
      const eventsByDate = new Map<
        string,
        { title: string; category: string; amount: number }[]
      >();
      formattedTransactions.map((transaction) => {
        if (eventsByDate.has(transaction.start)) {
          eventsByDate.get(transaction.start)?.push({
            title: transaction.title,
            category: transaction.category,
            type: transaction.type,
            amount: transaction.amount,
          });
        } else {
          eventsByDate.set(transaction.start, [
            {
              title: transaction.title,
              category: transaction.category,
              type: transaction.type,
              amount: transaction.amount,
            },
          ]);
        }
      });
      setEventsByDate(eventsByDate);
    } else {
      setMonthlySpent(0);
      setEvents([]);
    }
  }, [monthAndYear, data]);

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
            const type = info.event.extendedProps.type;
            const amount = info.event.extendedProps.amount;
            const category = info.event.extendedProps.category;
            const config = type === "Expense" ? expenseCategoryConfig[category] : incomeCategoryConfig[category];
            return (
              <div
                className="
                  flex items-center gap-1 px-2 py-[2px] rounded-md cursor-pointer
                  hover:scale-[1.02] transition-transform
                  text-[11px] font-medium
                "
                style={{
                  backgroundColor: `color-mix(in srgb, ${config.color} 75%, transparent)`,
                  color: "white",
                }}
              >
                <span className="truncate w-full">{info.event.title}</span>

                <span className="text-[10px] font-semibold ml-auto">
                  {type === "Expense" ? "-" + amount : "+" + amount}$
                </span>
              </div>
            );
          }}
          height={750}
        ></FullCalendar>
        {/*<div className="flex flex-row justify-items-start gap-1">
          <p>* </p>
          <div className="inline-block bg-red-500 text-red-500">*****</div>
          <p>: Upcoming recurring bill</p>
        </div>*/}
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
      <section className="w-full max-h-[500px] overflow-y-auto px-12 py-4 mb-8">
        <div className="max-w-[200px] mb-4">
          <Select defaultValue={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger className="border-none bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 shadow-md text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter</SelectLabel>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-6">
          {[...eventsByDate].map(([date, events]) => {
            console.log(events);
            const filtered =
              selectedItem === "All"
                ? events
                : events.filter((event) =>
                    selectedItem === "Expense"
                      ? event.category === "Expense"
                      : event.category === "Income",
                  );

            if (filtered.length === 0) return null;
            return (
              <div key={date} className="space-y-2">
                <div className="sticky top-0 bg-white/10 backdrop-blur-lg px-2 py-1 rounded-md text-xs font-semibold">
                  {new Date(date).toLocaleString("en", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="space-y-2">
                  {filtered.map((event, idx) => {
                    console.log(event);
                    const config = event.type === "Expense" ? expenseCategoryConfig[event.category] : incomeCategoryConfig[event.category];
                    console.log(config);

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-lg"
                            style={{
                              backgroundColor: `color-mix(in srgb, ${config.color} 40%, transparent)`,
                            }}
                          >
                            {config.icon}
                          </div>
                          <div className="flex flex-col leading-tight">
                            <span className="text-sm font-medium">
                              {event.title}
                            </span>
                            <span className="text-xs opacity-70">
                              {event.category}
                            </span>
                          </div>
                        </div>
                        <div>
                          {event.type === "Expense" ? "-" : "+"}
                          {Math.abs(event.amount)}$
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ExpenseCalendar;
