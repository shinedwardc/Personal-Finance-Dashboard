import { useState, useEffect } from "react";
import { ExpenseInterface } from "@/interfaces/interface";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
  const [chartData, setChartData] = useState<any[]>([]);

  const chartConfig = {
    date: {
      label: "Total spent",
      color: "#2563eb",
    },
  } satisfies ChartConfig

  useEffect(() => {
    if (data.length > 0){
        const filtered = data.filter((expense) => (
            expense.date.slice(5,7) === (currentDate.getMonth() + 1).toString()
        ));
        const total = filtered.reduce(
            (sum,event) => sum + parseInt(event.amount), 0
        )
        setMonthlySpent(total);
        // Create a map to hold cumulative amounts by date
        const cumulativeAmountPerBy = new Map();


        // Populate the map with filtered data
        filtered.forEach(({ date, amount }) => {
          const dateKey =
            date instanceof Date ? date.toISOString().split("T")[0] : date;
          const currentAmount = cumulativeAmountPerBy.get(dateKey) || 0;
          cumulativeAmountPerBy.set(dateKey, currentAmount + amount);
        });

        // Get the number of days in the current month
        const daysInCurrentMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).getDate();
        // Or get the current date if the year and month is the current local year and month
        const dayLimit = (
          currentDate.getFullYear() === new Date().getFullYear() &&
          currentDate.getMonth() === new Date().getMonth() ?
          new Date().getDate() :
          daysInCurrentMonth
        )
        // Fill in missing days of the current month
        for (let i = 1; i <= dayLimit; i++) {
          const dateKey = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            i + 1
          ).toISOString().split("T")[0];
          if (!cumulativeAmountPerBy.has(dateKey)) {
            cumulativeAmountPerBy.set(dateKey, 0);
          }
        }
        const sortedCumulativeAmountPerBy = new Map(
          [...cumulativeAmountPerBy.entries()].sort(([a], [b]) => {
            return new Date(a) - new Date(b)
          })
        );
        /*{"2024-11-03" => 6.33}
        
        {"2024-11-16" => 89.4}

        {"2024-11-17" => 16.33}

        {"2024-11-18" => -500}
        
        {"2024-11-20" => 5.4}

        {"2024-11-27" => 42}*/
        const chartDataArray = [];
        let amount = 0;
        for (const [key,value] of sortedCumulativeAmountPerBy.entries()){
          amount += value;
          const dateAmount = {
            date: key.slice(8,10),
            amount: amount
          }
          chartDataArray.push(dateAmount);
          sortedCumulativeAmountPerBy.set(key,amount);
        }
        setExpenseMap(sortedCumulativeAmountPerBy);
        console.log(chartDataArray);
        setChartData(chartDataArray);
    }
  },[data,currentDate])

  const handleArrow = (e) => {
    const increment = e.target.id === "leftArrow" ? -1 : 1;
    setCurrentDate(
      new Date(currentDate.setMonth(currentDate.getMonth() + increment)),
    );
  };

  return (
    <div className="w-2/3 ml-24">
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
        {(new Date().getFullYear() !== currentDate.getFullYear() || 
          new Date().getMonth() !== currentDate.getMonth()) && (
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
        )}
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
        <div className="w-full">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <AreaChart accessibilityLayer data={chartData} 
            margin={{
                left: 12,
                right: 12,
              }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" nameKey="date" hideLabel hideIndicator/>}
            />
            <Area
              dataKey="amount"
              type="linear"
              fill="var(--color-date)"
              fillOpacity={0.4}
              stroke="var(--color-date)"
            />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
      ) : (
        <>
        </>
      )}

    </div>
  );
};

export default Stats;
