import {
  createContext,
  Dispatch,
  RefObject,
  useRef,
  useEffect,
  useState,
  SetStateAction,
} from "react";
import { useExpenseContext } from "../hooks/useExpenseContext";
import FullCalendar from "@fullcalendar/react";

export const CalendarContext = createContext<{
  calendarRef: RefObject<FullCalendar | null>;
  events: {
    title: string;
    start: string;
    amount: number;
    frequency: string | null;
  }[];
  setEvents: Dispatch<
    SetStateAction<
      {
        title: string;
        start: string;
        amount: number;
        frequency: string | null;
      }[]
    >
  >;
  chosenEvents: {
    title: string;
    start: string;
    amount: number;
    frequency: string | null;
  }[];
  setChosenEvents: Dispatch<
    SetStateAction<
      {
        title: string;
        start: string;
        amount: number;
        frequency: string | null;
      }[]
    >
  >;
  getCurrentMonth: () => void;
  monthAndYear: Date,
  setMonthAndYear: Dispatch<SetStateAction<Date>>,
  monthlySpent: number;
  setMonthlySpent: Dispatch<SetStateAction<number>>;
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
} | undefined>(undefined);

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isDataLoading } = useExpenseContext();

  const calendarRef = useRef<FullCalendar | null>(null);

  const [events, setEvents] = useState<
    { title: string; start: string; amount: number; frequency: string | null }[]
  >([]);
  const [chosenEvents, setChosenEvents] = useState<
    { title: string; start: string; amount: number; frequency: string | null }[]
  >([]);
  const [monthAndYear, setMonthAndYear] = useState<Date>(new Date());
  const [monthlySpent, setMonthlySpent] = useState<number>(0);

  const [date, setDate] = useState<Date | undefined>(new Date());

  const getCurrentMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentMonth = calendarApi.getDate().getMonth();
      const currentYear = calendarApi.getDate().getFullYear();
      setMonthAndYear(new Date(currentYear, currentMonth, 1));
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
      //console.log(formattedEvents);
      const calculateDayExpenses = new Map();
      for (const event of formattedEvents) {
        if (calculateDayExpenses.has(event.start)) {
          calculateDayExpenses.set(
            event.start,
            calculateDayExpenses.get(event.start) + event.amount,
          );
        } else {
          calculateDayExpenses.set(event.start, event.amount);
        }
      }
      setEvents(formattedEvents);
    }
  }, [data]);

  useEffect(() => {
    //With Full Calendar reference
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
    //For the case when no FullCalendar reference (e.g., to filter events for current month)
    else if (!calendarRef.current){
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getMonth() === currentMonth &&
          eventDate.getFullYear() === currentYear &&
          event.amount >= 0
        );
      }
      );
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
  }, [events, date]);

  return (
    <CalendarContext.Provider value={{ 
      calendarRef,
      events,
      setEvents,
      chosenEvents,
      setChosenEvents,
      getCurrentMonth,
      monthAndYear,
      setMonthAndYear,
      monthlySpent,
      setMonthlySpent,
      date,
      setDate,
     }}>
      {children}
    </CalendarContext.Provider>
  );
};
