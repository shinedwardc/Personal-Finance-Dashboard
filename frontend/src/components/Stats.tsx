import { useState, useEffect } from "react";
import { ExpenseInterface } from "@/interfaces/interface";

const Stats = ({
  data,
  isLoading,
}: {
  data: ExpenseInterface[];
  isLoading: boolean;
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [monthlySpent, setMonthlySpent] = useState<number>(0);
  const [expenseMap, setExpenseMap] = useState<Map<string,number>>(new Map());
  useEffect(() => {
    if (data.length > 0){
        const filtered = data.filter((expense) => (
            expense.date.slice(5,7) === (currentDate.getMonth() + 1).toString()
        ));
        const total = filtered.reduce(
            (sum,event) => sum + parseInt(event.amount), 0
        )
        setMonthlySpent(total);
        const cumulativeAmountPerBy = new Map();
        for (let i = 0; i < filtered.length; i++){
          const dateKey = filtered[i].date instanceof Date 
          ? filtered[i].date.toISOString().split("T")[0] 
          : filtered[i].date;
          if (!cumulativeAmountPerBy.has(dateKey)){
            cumulativeAmountPerBy.set(filtered[i].date, filtered[i].amount);
          }
          else {
            const sum = cumulativeAmountPerBy.get(dateKey);
            cumulativeAmountPerBy.set(filtered[i].date, sum + filtered[i].amount);
          }
        }
        setExpenseMap(cumulativeAmountPerBy);
        const chartData = [];
        cumulativeAmountPerBy.forEach((date,amount) => {
          {
            date: date,
            
          }
        })
    }
  },[data,currentDate])

  const handleArrow = (e) => {
    const increment = e.target.id === "leftArrow" ? -1 : 1;
    setCurrentDate(
      new Date(currentDate.setMonth(currentDate.getMonth() + increment)),
    );
  };

  return (
    <div className="w-1/2 ml-36">
        <div className="flex flex-row justify-start gap-1">
        <button onClick={handleArrow}>
          <svg
            id="leftArrow"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <p>{currentDate.toISOString().split("T")[0].slice(0, 7)}</p>
        <button onClick={handleArrow}>
          <svg
            id="rightArrow"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
      {!isLoading ? (
      <div className="flex justify-center flex-col">
        <p>{monthlySpent}</p>
        <ul>
          {
            expenseMap.size > 0 && 
            Array.from(expenseMap).map(([date,amount]) => (
              <li key={date}>
                {date}: {amount}$
              </li>
            ))
          }
        </ul>
      </div>
      ) : (
        <>
        </>
      )}

    </div>
  );
};

export default Stats;
