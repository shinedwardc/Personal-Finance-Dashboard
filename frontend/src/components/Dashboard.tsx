import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wallet2,
  PieChart,
  Banknote,
  Gauge,
  Calendars,
  CalendarClock,
  PiggyBank,
  TriangleAlert,
} from "lucide-react";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { useMonthlyTransactions } from "@/hooks/useMonthlyTransactions";
import Form from "./Form";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TransactionInterface } from "@/interfaces/Transactions";
import { chartConfig } from "@/constants/chartConfig";
import { expenseCategoryConfig } from "@/constants/expenseCategoryConfig";
//import { incomeCategoryConfig } from "@/constants/incomeCategoryConfig";

const Dashboard = () => {
  const today = useMemo(() => new Date(), []);
  const { data: monthData, isLoading: isDataLoading } =
    useMonthlyTransactions(today);
  const lastMonthDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  }, []);
  const { data: lastMonthData, isLoading: isLastMonthLoading } =
    useMonthlyTransactions(lastMonthDate);

  const { userSettings, isUserSettingsLoading } = useSettingsContext();
  const [monthlySpent, setMonthlySpent] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [timeProgressed, setTimeProgressed] = useState<number>(0);
  const [dailyAverage, setDailyAverage] = useState<number>(0);
  const [projectedSpending, setProjectedSpending] = useState<number>(0);
  const [lastMonthSpent, setLastMonthSpent] = useState<number | null>(null);
  const [spendingChangePct, setSpendingChangePct] = useState<number | null>(
    null,
  );
  const [topSpendingCategories, setTopSpendingCategories] = useState<string[]>(
    [],
  );
  const [essentials, setEssentials] = useState<number>(0);
  const [discretionals, setDiscretionals] = useState<number>(0);
  const [graphData, setGraphData] = useState<
    Array<{ category: string; total: number }>
  >([]);

  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  const formatCurrency = (value: number) => {
    const currency = userSettings?.display_currency || 'USD';

    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const currentMonthLabel = today.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const lastMonthLabel = lastMonthDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!monthData || !today) return;

    const { expenses, income } = monthData.reduce(
      (acc, item) => {
        if (new Date(item.date) > today) return acc;

        if (item.type === "Income") {
          acc.income.push(item);
        } else {
          acc.expenses.push(item);
        }

        return acc;
      },
      { expenses: [] as TransactionInterface[], income: [] as TransactionInterface[] },
    );

    let expenseTotal = 0;

    const expenseTotals: Record<string, number> = {};
    let essentialSum = 0;
    let discretionarySum = 0;

    const discretionaryCats = new Set([
      "Restaurants",
      "Coffee & Snacks",
      "Alcohol & Bars",
      "Shopping",
      "Entertainment",
      "Subscriptions",
      "Flights",
      "Hotels",
      "Transportation Travel",
      "Travel Activities",
      "Gifts & Donations",
      "Personal Care",
      "Other",
    ]);
    for (const exp of expenses) {
      const amount = Number(exp.amount);

      expenseTotal += amount;

      // Essential vs discretionary
      if (discretionaryCats.has(exp.category)) {
        discretionarySum += amount;
      } else {
        essentialSum += amount;
      }

      // Expense group category totals
      expenseTotals[expenseCategoryConfig[exp.category].group] = (expenseTotals[expenseCategoryConfig[exp.category].group] || 0) + amount;
    }

    // Income total
    let incomeTotal = 0;

    for (const transaction of income) {
      const amount = Number(transaction.amount);
      incomeTotal += amount;
    }

    setMonthlySpent(expenseTotal);
    setMonthlyIncome(incomeTotal);
    setEssentials(essentialSum);
    setDiscretionals(discretionarySum);

    // Calculate top 3 spending categories
    const sortedTotals = Object.entries(expenseTotals).sort(
      (a, b) => b[1] - a[1],
    );
    const topValues = sortedTotals.slice(0, 3);

    setTopSpendingCategories(topValues.map(([name, _]) => name));
    // Graph data
    setGraphData(
      Object.keys(expenseTotals)
        .sort()
        .map((categoryName) => ({
          category: categoryName,
          total: expenseTotals[categoryName],
        })),
    );
    console.log('graphData: ', 
      Object.keys(expenseTotals)
        .sort()
        .map((categoryName) => ({
          category: categoryName,
          total: expenseTotals[categoryName],
        
        })),
    )
    console.log(chartConfig);

    const todayDate = today.getDate();
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();

    const dailyAvg = expenseTotal / todayDate;
    setDailyAverage(dailyAvg);
    setProjectedSpending(dailyAvg * daysInMonth);
    setTimeProgressed(todayDate / daysInMonth);
  }, [monthData, today]);

  useEffect(() => {
    if (!lastMonthData) return;

    const totalAmount = lastMonthData.reduce((sum, event) => {
      if (event.type === "Expense" && event.amount) {
        return sum + event.amount;
      }
      return sum;
    }, 0);

    setLastMonthSpent(totalAmount || 0);

    if (totalAmount > 0) {
      const diff = monthlySpent - totalAmount;
      const pct = (diff / totalAmount) * 100;
      setSpendingChangePct(pct);
    } else {
      setSpendingChangePct(null);
    }
  }, [lastMonthData, monthlySpent]);

  const isLoading = isDataLoading || isUserSettingsLoading || isLastMonthLoading;

  // Get an actual computed color from a CSS variable
  const getCssVarColor = (variable: string): string => {
    const temp = document.createElement("div");
    temp.style.color = variable;
    document.body.appendChild(temp);

    const rgb = getComputedStyle(temp).color;
    document.body.removeChild(temp);
    return rgb;
  };

  // Use luminance to determine whether black or white contrasts better
  const getContrastingTextColor = (rgbString: string): string => {
    const match = rgbString.match(/\d+/g);
    if (!match) return "#fff";
    const [r, g, b] = match.map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness >= 128 ? "#000" : "#fff";
  };
  return (
    <>
      {!isLoading ? (
        <div className="mt-10 ml-2 space-y-8 text-neutral-50">
          {/* Hero Header */}
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                Analytics Summary
              </h1>
              <p className="text-sm md:text-base text-neutral-400">
                Month-to-date spending, updated daily
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.35)]">
                <CalendarClock className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-medium text-neutral-200">
                  Today •{" "}
                  {today.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {spendingChangePct !== null && lastMonthSpent !== null && (
                <div className="text-xs text-neutral-400">
                  Compared to{" "}
                  <span className="font-medium text-neutral-200">
                    {lastMonthLabel}
                  </span>
                  :{" "}
                  <span
                    className={
                      spendingChangePct > 0
                        ? "text-red-400 font-semibold"
                        : "text-emerald-300 font-semibold"
                    }
                  >
                    {spendingChangePct > 0 ? "▲" : "▼"}{" "}
                    {Math.abs(spendingChangePct).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </header>
          {monthData && monthData.length > 0 ? (
            <>
              <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Card className="h-full rounded-2xl border border-white/15 bg-white/10 bg-gradient-to-br from-white/10 via-white/5 to-emerald-500/10 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-neutral-100">
                        This Month&apos;s Spending
                      </CardTitle>
                      <Wallet2 className="w-5 h-5 text-emerald-300" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-semibold tracking-tight text-red-400">
                        -{formatCurrency(monthlySpent)}
                      </p>
                      <p className="mt-2 text-xs text-neutral-400">
                        Total outgoing expenses recorded so far this month.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Card className="h-full rounded-2xl border border-white/15 bg-white/10 bg-gradient-to-br from-white/10 via-white/5 to-sky-500/10 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-neutral-100">
                        This Month's Income
                      </CardTitle>
                      <Banknote className="w-5 h-5 text-sky-300" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-semibold tracking-tight text-emerald-400">
                        +{formatCurrency(monthlyIncome)}
                      </p>
                      <p className="mt-2 text-xs text-neutral-400">
                        Total income from all sources recorded so far this
                        month.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Card className="h-full rounded-2xl border border-white/15 bg-white/10 bg-gradient-to-br from-white/10 via-white/5 to-rose-500/10 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-neutral-100">
                        Remaining Budget
                      </CardTitle>
                      <Gauge className="w-5 h-5 text-rose-300" />
                    </CardHeader>
                    <CardContent>
                      {userSettings.monthly_budget && !userSettings.income_affects_budget ? (
                        <>
                          <p className="text-sm font-semibold text-neutral-100">
                            {formatCurrency(monthlySpent)}{" "}
                            <span className="text-neutral-400 text-xs">
                              / {formatCurrency(userSettings.monthly_budget)}
                            </span>
                          </p>
                          <p
                            className={`mt-1 text-xs ${
                              userSettings.monthly_budget -
                                Number(monthlySpent.toFixed(2)) <
                              0
                                ? "text-red-300"
                                : "text-emerald-300"
                            }`}
                          >
                            {userSettings.monthly_budget -
                              Number(monthlySpent.toFixed(2)) <
                            0
                              ? `Over budget by ${formatCurrency(
                                  Math.abs(
                                    userSettings.monthly_budget -
                                      Number(monthlySpent.toFixed(2)),
                                  ),
                                )}`
                              : `You have ${formatCurrency(
                                  userSettings.monthly_budget -
                                    Number(monthlySpent.toFixed(2)),
                                )} left this month.`}
                          </p>
                          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                            {userSettings.monthly_budget > 0 && (
                              <div
                                className={`h-full rounded-full ${
                                  monthlySpent > userSettings.monthly_budget
                                    ? "bg-red-400"
                                    : "bg-emerald-400"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    (monthlySpent / userSettings.monthly_budget) * 100,
                                    110
                                  )}%`,
                                }}
                              />
                            )}
                          </div>
                        </>
                      ) : userSettings.income_affects_budget && userSettings.monthly_budget ? (
                        <>
                          <p className="text-sm font-semibold text-neutral-100">
                            {formatCurrency(monthlySpent)}{" "}
                            <span className="text-neutral-400 text-xs">
                              / {userSettings.income_based_budget ? formatCurrency(userSettings.income_based_budget) : formatCurrency(userSettings.monthly_budget)}
                            </span>
                          </p>
                          <p
                            className={`mt-1 text-xs ${
                              userSettings.income_based_budget ? userSettings.income_based_budget : userSettings.monthly_budget -
                                Number(monthlySpent.toFixed(2)) <
                              0
                                ? "text-red-300"
                                : "text-emerald-300"
                            }`}
                          >
                            {userSettings.income_based_budget ? userSettings.income_based_budget : userSettings.monthly_budget -
                              Number(monthlySpent.toFixed(2)) <
                            0
                              ? `Over budget by ${formatCurrency(
                                  Math.abs(
                                    userSettings.income_based_budget ? userSettings.income_based_budget : userSettings.monthly_budget -
                                      Number(monthlySpent.toFixed(2)),
                                  ),
                                )}`
                              : `You have ${formatCurrency(
                                  userSettings.income_based_budget ? userSettings.income_based_budget : userSettings.monthly_budget -
                                    Number(monthlySpent.toFixed(2)),
                                )} left this month.`}
                          </p>
                          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                            {userSettings.income_based_budget ? userSettings.income_based_budget : userSettings.monthly_budget > 0 && (
                              <div
                                className={`h-full rounded-full ${
                                  monthlySpent > (userSettings.income_based_budget ? userSettings.income_based_budget : userSettings.monthly_budget)
                                    ? "bg-red-400"
                                    : "bg-emerald-400"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    (monthlySpent / (userSettings.income_based_budget ? userSettings.income_based_budget : userSettings.monthly_budget) * 100),
                                    110
                                  )}%`,
                                }}
                              />
                            )}
                          </div>                        
                        </>
                      ) : (
                        <p className="text-sm text-red-300">
                          Add a monthly budget in profile settings or add income to unlock
                          budget tracking.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </section>
              <section className="grid gap-4 md:grid-cols-3">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Card className="h-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium text-neutral-100">
                        Daily Average
                      </CardTitle>
                      <CardDescription className="text-xs text-neutral-400">
                        What you&apos;re spending per day this month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold">
                        {formatCurrency(dailyAverage || 0)}
                      </p>
                      <p className="mt-2 text-xs text-neutral-400">
                        Based on {today.getDate()} days elapsed.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Card className="h-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium text-neutral-100">
                        Projected Month-End Spend
                      </CardTitle>
                      <CardDescription className="text-xs text-neutral-400">
                        If you keep spending like this.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold">
                        {projectedSpending > 0
                          ? projectedSpending >= 100
                            ? `${formatCurrency(Math.floor(projectedSpending / 100) * 100)} - ${formatCurrency(Math.floor(projectedSpending / 100) * 100 + 100)}`
                            : "0 - 100"
                          : 0}
                      </p>
                      {userSettings.monthlyBudget && (
                        <p className="mt-2 text-xs text-neutral-400">
                          This is{" "}
                          <span
                            className={
                              projectedSpending > userSettings.monthlyBudget
                                ? "text-red-300 font-semibold"
                                : "text-emerald-300 font-semibold"
                            }
                          >
                            {projectedSpending > userSettings.monthlyBudget
                              ? "above"
                              : "within"}
                          </span>{" "}
                          your monthly budget.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Card className="h-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="pb-2">
                      <div className="flex flex-row justify-between">
                        <CardTitle className="text-md font-medium text-neutral-100">
                          Month-over-Month
                        </CardTitle>
                        <Calendars className="w-5 h-5" />
                      </div>
                      <CardDescription className="text-xs text-neutral-400">
                        Change vs {lastMonthLabel}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {lastMonthSpent !== null ? (
                        <>
                          <p className="text-xl text-neutral-300">
                            Last month:{" "}
                            <span className="text-lg font-medium text-neutral-100">
                              {formatCurrency(lastMonthSpent)}
                            </span>
                          </p>
                          {spendingChangePct !== null && (
                            <p className="text-xs text-neutral-400">
                              You&apos;re currently{" "}
                              <span
                                className={
                                  spendingChangePct > 0
                                    ? "text-red-300 font-semibold"
                                    : "text-emerald-300 font-semibold"
                                }
                              >
                                {spendingChangePct > 0 ? "up" : "down"}{" "}
                                {Math.abs(spendingChangePct).toFixed(1)}%
                              </span>{" "}
                              vs last month.
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-neutral-300">
                          Not enough data from last month yet.
                        </p>
                      )}
                      {/*largestExpense && (
                        <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-300">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-neutral-100">
                              Largest Expense
                            </span>
                            <span className="font-semibold text-rose-300">
                              {formatCurrency(
                                Number(largestExpense.amount) || 0,
                              )}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-neutral-400">
                            {largestExpense.category} •{" "}
                            {new Date(
                              largestExpense.date,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )*/}
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Card className="h-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="pb-2">
                      <div className="flex flex-row justify-between">
                        <CardTitle className="text-md font-medium text-neutral-100 pb-2">
                          Essential Spending
                        </CardTitle>
                        <PiggyBank className="w-5 h-5 stroke-pink-400" />
                      </div>
                      <CardDescription className="text-xs text-neutral-400">
                        Essentials to discretional expenses payment score
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <span className="text-md font-semibold">
                        Essentials made up{" "}
                        <span
                          className={`
                            ${
                              essentials / (essentials + discretionals) < 0.5
                                ? essentials / (essentials + discretionals) <
                                  0.35
                                  ? "text-emerald-400"
                                  : "text-yellow-300"
                                : "text-red-400"
                            }`}
                        >
                          {`${((essentials / (essentials + discretionals)) * 100).toFixed(1)}`}
                          %
                        </span>{" "}
                        of your spending
                      </span>
                      <p className="text-xs text-neutral-400">
                        Aim to spend no less than 50% on essentials.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Card className="h-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="pb-2">
                      <div className="flex flex-row justify-between">
                        <CardTitle className="text-md font-medium text-neutral-100 pb-2">
                          Overspending Risk
                        </CardTitle>
                        <TriangleAlert className="h-5 w-5 stroke-red-400" />
                      </div>
                      <CardDescription className="text-xs text-neutral-400">
                        Based on pace of spending, chance of spending over
                        budget?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                    {userSettings.monthly_budget ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-lg font-semibold">
                              <span
                                className={`${
                                  monthlySpent / userSettings.monthly_budget / timeProgressed >=
                                  1.2
                                    ? "text-red-500"
                                    : monthlySpent /
                                        userSettings.monthly_budget /
                                        timeProgressed >=
                                      0.9
                                    ? "text-yellow-400"
                                    : "text-emerald-400"
                                }`}
                              >
                                {`${(
                                  (monthlySpent / userSettings.monthly_budget / timeProgressed) *
                                  100
                                ).toFixed(1)}`}
                                %
                              </span>{" "}
                              overspending risk
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>100% = On pace</p>
                            <p>&gt; 100% = Overspending risk</p>
                            <p>&lt; 100% = Underspending</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <p className="text-sm text-red-300">
                        Add a monthly budget in profile settings to unlock
                        overspending risk analysis.
                      </p>
                    )}
                      <p className="text-xs text-neutral-400">
                        Overspending Risk compares your actual spending with
                        your expected spending based on how far into the month
                        you are.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Card className="h-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-neutral-100">
                        Top Spending Categories
                      </CardTitle>
                      <PieChart className="w-5 h-5 text-cyan-300" />
                    </CardHeader>
                    <CardContent>
                      {topSpendingCategories.length > 0 ? (
                        <div className="flex flex-col gap-1 w-full justify-center ">
                          {topSpendingCategories.map((category, index) => {
                            const categoryKey = category
                              .replace(/[^a-zA-Z0-9]/g, "-")
                              .toLowerCase();
                            return (
                              <div
                                key={category}
                                className="flex flex-row gap-x-2 justify-center items-center w-full text-sm"
                              >
                                <span className="w-1/6 text-neutral-300 font-bold text-center">
                                  {index + 1}.
                                </span>
                                <span
                                  className="w-5/6 rounded-full px-2 py-1 text-center font-medium border"
                                  style={{
                                    backgroundColor: `color-mix(in srgb, var(--color-${categoryKey}) 70%, transparent)`,
                                    borderColor: `var(--color-${categoryKey})`,
                                  }}
                                >
                                  {category}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-400">
                          No spending data available.
                        </p>
                      )}
                      <p className="mt-3 text-xs text-neutral-400">
                        Categories tied for the highest total spend this month.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </section>
              <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/80 p-5 md:p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-neutral-50">
                    Spending by Category
                  </h2>
                  <p className="text-xs text-neutral-400 max-w-md">
                    Visualize how your spending breaks down across categories.
                    Hover a bar or slice to see exact amounts.
                  </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <Card className="w-full lg:w-1/2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="pb-5">
                      <CardTitle className="text-sm font-medium text-neutral-100">
                        Bar Chart
                      </CardTitle>
                      <CardDescription className="text-xs text-neutral-400">
                        Height shows total spent per category.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <ChartContainer
                        config={chartConfig}
                        className="h-[280px]"
                      >
                        <BarChart
                          accessibilityLayer
                          data={graphData}
                          margin={{ top: 20, bottom: 5, left: 0, right: 0 }}
                        >
                          <XAxis
                            dataKey={(entry) => {
                              return (entry.category);
                            }}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tick={{ fill: "#e5e7eb", fontSize: 11 }}
                          />
                          <YAxis
                            scale="auto"
                            tickCount={5}
                            unit="$"
                            tick={{ fill: "#e5e7eb", fontSize: 11 }}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={
                              <ChartTooltipContent
                                labelKey="category"
                                nameKey="total"
                              />
                            }
                          />
                          <Bar dataKey="total" radius={8}>
                            {graphData.map((item, index) => (
                              <Cell
                                key={index}
                                fill={`var(--color-${item.category.replace(
                                  /\s+/g,
                                  "-",
                                ).toLowerCase()})`}
                              />
                            ))}
                            <LabelList
                              position="top"
                              offset={10}
                              fontSize={11}
                              className="fill-neutral-100"
                            />
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  <Card className="w-full lg:w-1/2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                    <CardHeader className="pb-5">
                      <CardTitle className="text-sm font-medium text-neutral-100">
                        Pie Chart
                      </CardTitle>
                      <CardDescription className="text-xs text-neutral-400">
                        Slice size shows each category&apos;s share of total
                        spending.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center">
                      <ChartContainer
                        config={chartConfig}
                        className="h-[280px]"
                      >
                        <RechartsPieChart>
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                labelKey="category"
                                nameKey="total"
                              />
                            }
                          />
                          <Pie
                            data={graphData}
                            dataKey="total"
                            labelLine={false}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={100}
                            label={({
                              cx,
                              cy,
                              midAngle,
                              innerRadius,
                              outerRadius,
                              percent,
                              payload,
                            }) => {
                              const RADIAN = Math.PI / 180;
                              const radius =
                                innerRadius + (outerRadius - innerRadius) * 0.5;
                              const x =
                                cx + radius * Math.cos(-midAngle * RADIAN);
                              const y =
                                cy + radius * Math.sin(-midAngle * RADIAN);
                              const cssVar = `var(--color-${payload.category.replace(
                                /\s+/g,
                                "-",
                              ).toLowerCase()})`;
                              // Convert CSS variable → actual rgb → pick contrasting black or white
                              const actualColor = getCssVarColor(cssVar);
                              const contrastText =
                                getContrastingTextColor(actualColor);
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  fill={contrastText}
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fontSize={11}
                                >
                                  {percent * 100 >= 5 &&
                                    `${(percent * 100).toFixed(0)}%`}
                                </text>
                              );
                            }}
                          >
                            {graphData.map((item, index) => (
                              <Cell
                                key={index}
                                fill={`var(--color-${item.category.replace(
                                  /\s+/g,
                                  "-",
                                ).toLowerCase()})`}
                              />
                            ))}
                          </Pie>
                          <ChartLegend
                            content={<ChartLegendContent nameKey="category" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                          />
                        </RechartsPieChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </>
          ) : (
            <div className="mt-10 text-center">
              <h2 className="text-2xl font-semibold text-neutral-100">
                No expenses found
              </h2>
              <p className="mt-2 text-neutral-400">
                Start adding your expenses below or in the transactions page to
                see your overview.
              </p>
              <div className="mt-8 flex justify-center">
              <Dialog open={modalIsOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <button
                    className="rounded-full bg-emerald-500/90 px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(16,185,129,0.55)] hover:bg-emerald-400 transition
                                "
                  >
                    Add transaction
                  </button>
                </DialogTrigger>
                <DialogContent className="z-50"
                  onInteractOutside={(e) => e.preventDefault()}
                  onPointerDownOutside={(e) => e.preventDefault()}          
                >
                  <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                  </DialogHeader>
                  <Form 
                    addingNewTransaction={true} 
                    onFormSubmit={() => setIsOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 ml-2">
          <Skeleton className="mb-6 h-[48px] w-[350px]" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-[150px] w-[330px] rounded-2xl"
              />
            ))}
          </div>
          <Skeleton className="mt-4 h-[531px] w-[1368px] rounded-3xl" />
        </div>
      )}
    </>
  );
};

export default Dashboard;
