import { useState, useEffect, useMemo } from "react";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import { useProfileContext } from "@/hooks/useProfileContext";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./ui/button";
import { SquareChevronLeft, SquareChevronRight } from "lucide-react";

const Stats = () => {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState<Date>(today);

  const { profileSettings } = useProfileContext();

  // Fetch monthly data from current view date
  const { data, isLoading } = useMonthlyExpenses(viewDate);

  const [rightArrow, setRightArrow] = useState<boolean>(true);

  const [monthlySpent, setMonthlySpent] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);

  const chartConfig = {
    date: {
      label: "Total spent",
      color: "#FF0000",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    if (data && today && viewDate) {
      console.log(viewDate);
      setRightArrow(
        viewDate.getMonth() >= today.getMonth() &&
          viewDate.getFullYear() >= today.getFullYear(),
      );

      // Filter out future or upcoming expenses if viewDate is current month and year
      const monthlyData =
        viewDate.getMonth() != today.getMonth() ||
        viewDate.getFullYear() != today.getFullYear()
          ? data
          : data.filter(
              (expense) => expense.date <= today.toISOString().slice(0, 10),
            );

      const total = monthlyData.reduce(
        (sum, event) => sum + parseInt(event.amount),
        0,
      );
      setMonthlySpent(total);

      // Create a map to hold cumulative amounts by date
      const cumulativeAmountPerBy = new Map();

      // Filter data for the selected month and populate map
      monthlyData.forEach(({ date, amount }) => {
        const dateKey =
          date instanceof Date ? date.toISOString().split("T")[0] : date;
        const currentAmount = cumulativeAmountPerBy.get(dateKey) || 0;
        cumulativeAmountPerBy.set(dateKey, currentAmount + amount);
      });

      // Get the number of days in the current month
      const daysInCurrentMonth = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth() + 1,
        0,
      ).getDate();
      // Or get the current date if the year and month is the current local year and month
      const dayLimit =
        viewDate.getFullYear() === today.getFullYear() &&
        viewDate.getMonth() === today.getMonth()
          ? today.getDate()
          : daysInCurrentMonth;

      // Fill in missing days of the current month
      for (let i = 1; i <= dayLimit; i++) {
        const dateKey = new Date(
          viewDate.getFullYear(),
          viewDate.getMonth(),
          i + 1,
        )
          .toISOString()
          .split("T")[0];
        if (!cumulativeAmountPerBy.has(dateKey)) {
          cumulativeAmountPerBy.set(dateKey, 0);
        }
      }

      const sortedCumulativeAmountPerBy = new Map(
        [...cumulativeAmountPerBy.entries()].sort(([a], [b]) => {
          return new Date(a) - new Date(b);
        }),
      );

      const chartDataArray = [];
      let cumulative = 0;

      let currentMonth = null;
      let currentYear = null;

      for (const [key, value] of sortedCumulativeAmountPerBy.entries()) {
        const dateObj = new Date(key);

        const month = dateObj.getMonth();
        const year = dateObj.getFullYear();

        // Reset cumulative when month changes
        if (currentMonth !== month || currentYear !== year) {
          cumulative = 0;
          currentMonth = month;
          currentYear = year;
        }

        cumulative += value;

        chartDataArray.push({
          date: dateObj.getDate().toString(),
          amount: cumulative,
        });
      }

      setChartData(chartDataArray);
    }
  }, [data, today, viewDate]);

  const handleArrow = (e) => {
    const increment = e.currentTarget.id === "leftArrow" ? -1 : 1;

    setViewDate((prev) => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return new Date(year, month + increment, prev.getDate());
    });
  };

  return (
    <div className="mt-12 w-full max-w-lg mx-auto sm:max-w-xl md:max-w-2xl">
      <div className="flex flex-row justify-start gap-1">
        <Button
          size="icon"
          variant="ghost"
          id="leftArrow"
          onClick={handleArrow}
        >
          <SquareChevronLeft />
        </Button>
        <p className="flex items-center w-[80px] justify-center">
          {viewDate.toISOString().split("T")[0].slice(0, 7)}
        </p>
        <Button
          size="icon"
          variant="ghost"
          id="rightArrow"
          onClick={handleArrow}
          disabled={rightArrow}
        >
          <SquareChevronRight />
        </Button>
      </div>
      {!isLoading ? (
        <div className="flex justify-center flex-col">
          {rightArrow ? (
            <div className="flex flex-col justify-center items-center m-5">
              <h3 className="font-bold text-2xl">
                {profileSettings.monthlyBudget - monthlySpent}$ left
              </h3>
              <p className="font-thin italic text-md">
                Out of {profileSettings.monthlyBudget}$ budgeted
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center m-5">
              <h3 className="font-bold text-2xl mb-[24px]">
                {monthlySpent}$ Spent
              </h3>
            </div>
          )}
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
                  type="monotone"
                  dot={{ stroke: "red", strokeWidth: 2 }}
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
