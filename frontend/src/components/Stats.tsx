import { useState, useEffect, useMemo } from "react";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const Stats = () => {
  const today = useMemo(() => new Date(), []);
  const { data, isLoading } = useMonthlyExpenses(today);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [monthlySpent, setMonthlySpent] = useState<number>(0);
  //const [expenseMap, setExpenseMap] = useState<Map<string, number>>(new Map());
  const [chartData, setChartData] = useState<any[]>([]);

  const chartConfig = {
    date: {
      label: "Total spent",
      color: "#FF0000",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    if (data && data.length > 0) {
      const selectedMonthExpenses = data.filter((expense) => {
        //Check if the month of the expense is the same as the month selected
        const expenseMonth =
          expense.date.slice(5, 6) === "0"
            ? expense.date.slice(6, 7)
            : expense.date.slice(5, 7);
        const expenseYear = expense.date.slice(0, 4);
        if (expenseYear === currentDate.getFullYear().toString()) {
          return expenseMonth === (currentDate.getMonth() + 1).toString();
        }
      });
      /*const prevMonthExpenses = data.filter((expense) => (
          expense.date.slice(5,7) === (currentDate.getMonth()).toString()
        ));
        console.log('prev month: ', prevMonthExpenses);*/
      const total = selectedMonthExpenses.reduce(
        (sum, event) => sum + parseInt(event.amount),
        0,
      );
      setMonthlySpent(total);
      // Create a map to hold cumulative amounts by date
      const cumulativeAmountPerBy = new Map();
      // Filter data for the selected month and populate map
      selectedMonthExpenses.forEach(({ date, amount }) => {
        const dateKey =
          date instanceof Date ? date.toISOString().split("T")[0] : date;
        const currentAmount = cumulativeAmountPerBy.get(dateKey) || 0;
        cumulativeAmountPerBy.set(dateKey, currentAmount + amount);
      });

      /*const prevMonthCumulativeAmountPerBy = new Map();
        // Filter data for the month before the selected month and populate map
        prevMonthExpenses.forEach(({ date, amount }) => {
          const dateKey =
            date instanceof Date ? date.toISOString().split("T")[0] : date;
          const currentAmount = prevMonthCumulativeAmountPerBy.get(dateKey) || 0;
          prevMonthCumulativeAmountPerBy.set(dateKey, currentAmount + amount);
        })
        //const mergedMap = new Map([...prevMonthCumulativeAmountPerBy,...cumulativeAmountPerBy]);
        //console.log('mergedmap ', mergedMap);*/

      // Get the number of days in the current month
      const daysInCurrentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      ).getDate();
      // Or get the current date if the year and month is the current local year and month
      const dayLimit =
        currentDate.getFullYear() === new Date().getFullYear() &&
        currentDate.getMonth() === new Date().getMonth()
          ? new Date().getDate()
          : daysInCurrentMonth;
      // Fill in missing days of the current month
      for (let i = 1; i <= dayLimit; i++) {
        const dateKey = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          i + 1,
        )
          .toISOString()
          .split("T")[0];
        const prevDateKey = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          i + 1,
        )
          .toISOString()
          .split("T")[0];
        if (!cumulativeAmountPerBy.has(dateKey)) {
          cumulativeAmountPerBy.set(dateKey, 0);
        }
        /*if (!cumulativeAmountPerBy.has(prevDateKey)) {
            cumulativeAmountPerBy.set(prevDateKey,0);
          }*/
      }
      const sortedCumulativeAmountPerBy = new Map(
        [...cumulativeAmountPerBy.entries()].sort(([a], [b]) => {
          return new Date(a) - new Date(b);
        }),
      );
      const chartDataArray = [];
      let amount = 0;
      let currMonth = sortedCumulativeAmountPerBy
        .keys()
        .next()
        .value.slice(5, 7);
      let currYear = sortedCumulativeAmountPerBy
        .keys()
        .next()
        .value.slice(0, 4);
      for (const [key, value] of sortedCumulativeAmountPerBy.entries()) {
        const entryMonth = key.slice(5, 7);
        const entryYear = key.slice(0, 4);
        if (entryMonth !== currMonth) {
          amount = 0;
          currMonth = key.slice(5, 7);
        }
        if (entryYear === currYear) {
          amount += value;
          const dateAmount = {
            date:
              key.slice(8, 10)[0] === "0" ? key.slice(9, 10) : key.slice(8, 10),
            amount: amount,
          };
          chartDataArray.push(dateAmount);
          sortedCumulativeAmountPerBy.set(key, amount);
        }
      }
      //setExpenseMap(sortedCumulativeAmountPerBy);
      //console.log('sorted cumulative amount per by', sortedCumulativeAmountPerBy);
      //console.log('chart data array',chartDataArray);
      setChartData(chartDataArray);
    }
  }, [data, currentDate]);

  const handleArrow = (e) => {
    const increment = e.currentTarget.id === "leftArrow" ? -1 : 1;
    setCurrentDate(
      new Date(currentDate.setMonth(currentDate.getMonth() + increment)),
    );
  };

  return (
    <div className="w-2/3 ml-24 mt-12">
      <div className="flex flex-row justify-start gap-1">
        {((new Date().getFullYear() > currentDate.getFullYear() &&
          new Date().getMonth() < currentDate.getMonth()) ||
          new Date().getFullYear() === currentDate.getFullYear()) && (
          <button className="bg-green-600" id="leftArrow" onClick={handleArrow}>
            <svg
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
        )}
        <p>{currentDate.toISOString().split("T")[0].slice(0, 7)}</p>
        {(new Date().getFullYear() !== currentDate.getFullYear() ||
          new Date().getMonth() !== currentDate.getMonth()) && (
          <button
            className="bg-green-600"
            id="rightArrow"
            onClick={handleArrow}
          >
            <svg
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
          <p className="m-5">{monthlySpent}$</p>
          {/*<ul>
          {
            expenseMap.size > 0 && 
            Array.from(expenseMap).map(([date,amount]) => (
              <li key={date}>
                {date}: {amount}$
              </li>
            ))
          }
        </ul>*/}
          <div className="w-full">
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 2)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={5}
                  tickFormatter={(value) => value.toString() + "$"}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="date" hideIndicator />}
                />
                <Legend />
                <Area
                  dataKey="amount"
                  type="linear"
                  fill="var(--color-date)"
                  fillOpacity={0.4}
                  stroke="var(--color-date)"
                  name="Expense total trend"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Stats;
