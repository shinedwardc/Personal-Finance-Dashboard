import { useEffect, useState, useMemo } from "react";
import { useProfileContext } from "@/hooks/useProfileContext";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  LabelList,
} from "recharts";
import ModalButton from "./ui/modal-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import Form from "./Form";
import { ExpenseInterface } from "../interfaces/expenses";
import { PlaidResponse } from "../interfaces/plaid";

const Dashboard = ({ plaidBalance }: { plaidBalance: PlaidResponse }) => {
  //const { data, setData, isDataLoading } = useExpenseContext();
  const today = useMemo(() => new Date(), []);
  const { data, isLoading: isDataLoading } = useMonthlyExpenses(today);
  const { profileSettings, isProfileLoading } = useProfileContext();
  const [monthlySpent, setMonthlySpent] = useState<number>(0);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {},
  );
  const [balance, setBalance] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [topSpendingCategories, setTopSpendingCategories] = useState<string[]>(
    [],
  );
  const [graphData, setGraphData] = useState<
    Array<{ category: string; total: number }>
  >([]);
  //const [graphType, setGraphType] = useState<string>("bar");

  const chartConfig = {
    total: {
      label: "Spent on category",
    },
    "Bank-Fees": {
      label: "Bank Fees",
      color: "#d1fae5", // light teal
    },
    "Cash-Advance": {
      label: "Cash Advance",
      color: "#6ee7b7", // mint green
    },
    Community: {
      label: "Community",
      color: "#10b981", // emerald
    },
    "Food-and-Drink": {
      label: "Food and Drink",
      color: "#facc15", // yellow
    },
    Healthcare: {
      label: "Healthcare",
      color: "#f87171", // light red
    },
    Interest: {
      label: "Interest",
      color: "#fcd34d", // gold
    },
    "Loan-Payments": {
      label: "Loan Payments",
      color: "#fde68a", // sand
    },
    Other: {
      label: "Other",
      color: "#e5e7eb", // gray
    },
    Payment: {
      label: "Payment",
      color: "#60a5fa", // blue
    },
    Recreation: {
      label: "Recreation",
      color: "#a78bfa", // light purple
    },
    Service: {
      label: "Service",
      color: "#f472b6", // pink
    },
    Shops: {
      label: "Shops",
      color: "#c084fc", // purple
    },
    Tax: {
      label: "Tax",
      color: "#fb923c", // orange
    },
    Transfer: {
      label: "Transfer",
      color: "#93c5fd", // sky blue
    },
    Travel: {
      label: "Travel",
      color: "#34d399", // teal
    },
    Utilities: {
      label: "Utilities",
      color: "#fbbf24", // amber
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const initialize = async () => {
      try {
        const totalAmount = data.reduce((sum, event) => {
          if (event.amount >= 0) {
            return sum + event.amount;
          }
          return sum;
        }, 0);
        setMonthlySpent(totalAmount);
        const totals = await calculateTotalByCategory(data);
        setCategoryTotals(totals);
        const newCategories = new Set<string>();
        for (const expense of data) {
          const categoryName = expense.category;
          newCategories.add(categoryName);
        }
        //console.log("categories: ", newCategories);
        setCategories(Array.from(newCategories));
        setCategoryLoading(false);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    if (!data) return;
    initialize();
  }, [data]);

  useEffect(() => {
    if (plaidBalance) {
      //console.log("plaidBalance", plaidBalance);
      let balance = 0;
      for (const account of plaidBalance.accounts) {
        balance += account.balances.available;
      }
      //console.log("balance", balance);
      setBalance(balance);
    }
  }, [plaidBalance]);

  const calculateTotalByCategory = async (
    expenses: ExpenseInterface[],
  ): Promise<Record<string, number>> => {
    const totals: Record<string, number> = {};
    //setTotal(0);
    //console.log("expenses", expenses);
    for (const expense of expenses) {
      const amount = parseFloat(expense.amount.toString());
      if (amount < 0) continue;
      const categoryName = expense.category;

      totals[categoryName] = (totals[categoryName] || 0) + amount;
    }
    const sortedCategoryTotals = Object.entries(totals).sort(
      ([, a], [, b]) => b - a,
    );
    const topSpenders: string[] = [];
    if (sortedCategoryTotals.length > 0) {
      const topValue = sortedCategoryTotals[0][1];
      for (const [category, value] of sortedCategoryTotals) {
        if (value === topValue) {
          topSpenders.push(category);
        } else {
          break;
        }
      }
      setTopSpendingCategories(topSpenders);
    }
    //console.log(totals);
    const graphData = [];
    for (const category of Object.keys(totals).sort()) {
      const totalObj = {
        category: category,
        total: totals[category],
      };
      graphData.push(totalObj);
    }
    //console.log(graphData);
    setGraphData(graphData);
    return totals;
  };


  return (
    <>
      {!isDataLoading && !isProfileLoading ? (
        <div className="mt-10 ml-2">
          <h1 className="text-[#6abeb4] text-5xl mb-6">Overview</h1>
          <p className="text-gray-300 mb-2">
            Start money management with a birds-eye view of your expenses
          </p>
          {data && data.length > 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-xl h-[180px] w-[330px]">
                  <CardHeader>
                    <CardTitle>This Month's Spending</CardTitle>
                    <CardDescription>
                      Total monthly spent amount
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="bt-[-6]">
                    <h1 className="font-bold">${monthlySpent}</h1>
                  </CardContent>
                </Card>
                <Card className="rounded-xl h-[180px] w-[330px]">
                  <CardHeader>
                    <CardTitle>Top spending categories</CardTitle>
                    <CardDescription>
                      View your top spending categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topSpendingCategories.length > 0 ? (
                      <p className="text-sm text-yellow-200">
                        {topSpendingCategories.join(", ")}
                      </p>
                    ) : (
                      <p className="text-sm">No spending data available</p>
                    )}
                  </CardContent>
                </Card>
                <Card className="rounded-xl h-[180px] w-[330px]">
                  <CardHeader>
                    <CardTitle>Current balance</CardTitle>
                    <CardDescription>
                      View your current account balance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>${balance.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl h-[180px] w-[330px]">
                  <CardHeader>
                    <CardTitle>Remaining budget</CardTitle>
                    <CardDescription>
                      Monthly spent so far / Set monthly budget
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profileSettings.monthlyBudget !== null ? (
                      <>
                        <h1
                          className={`text-sm font-semibold ${profileSettings.monthlyBudget - Number(monthlySpent.toFixed(2)) < 0 ? "text-red-400" : "text-green-200"}`}
                        >
                          ${monthlySpent} / ${profileSettings.monthlyBudget}
                        </h1>
                        <h3
                          className={`text-sm ${profileSettings.monthlyBudget - Number(monthlySpent.toFixed(2)) < 0 ? "text-red-400" : "text-yellow-200"}`}
                        >
                          {profileSettings.monthlyBudget -
                            Number(monthlySpent.toFixed(2)) <
                          0
                            ? `Spent over monthly budget limit by ${Math.abs(profileSettings.monthlyBudget - Number(monthlySpent.toFixed(2))).toFixed(2)}$`
                            : `You have ${(profileSettings.monthlyBudget - Number(monthlySpent.toFixed(2))).toFixed(2)}$ left until budget limit`}
                        </h3>
                      </>
                    ) : (
                      <p className="text-sm text-red-400">
                        Add a budget limit in profile settings
                      </p>
                    )}
                  </CardContent>
                </Card>
                {/*<Card>
                  <CardHeader>
                    <CardTitle>
                      Largest Expense
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Average daily spending
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Total expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>${total.toFixed(2)}</p>
                  </CardContent>
                </Card>*/}
              </div>
              <div className="mt-4 p-5 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50">
                <div>
                  <h1 className="text-2xl font-semibold text-black dark:text-white ml-4">
                    Spending by category visualized
                  </h1>
                </div>
                <div className="flex flex-row gap-4 mt-4">
                  <Card className="w-1/2 rounded-xl">
                    <CardHeader>
                      <CardTitle className="font-normal">Bar</CardTitle>
                    </CardHeader>
                    <CardDescription>
                      <ChartContainer config={chartConfig}>
                        <BarChart
                          accessibilityLayer
                          data={graphData}
                          margin={{ top: 20, bottom: 5 }}
                        >
                          <XAxis
                            dataKey="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                          />
                          <YAxis scale="auto" tickCount={5} unit={"$"} />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent
                                labelKey="category"
                                nameKey="total" 
                            />}
                          />
                          <Bar
                            dataKey="total"
                            radius={8}
                          >
                            {graphData.map((item, index) => (
                              <Cell
                                key={index}
                                fill={`var(--color-${item.category.replace(/\s+/g, "-")})`}
                              />
                            ))}                            
                            <LabelList
                              position="top"
                              offset={10}
                              fontSize={12}
                            />
                          </Bar>
                          {/*<ChartLegend content={<ChartLegendContent/>} />*/}
                        </BarChart>
                      </ChartContainer>
                    </CardDescription>
                  </Card>
                  <Card className="w-1/2 rounded-xl">
                    <CardHeader>
                      <CardTitle className="font-normal">Pie</CardTitle>
                    </CardHeader>
                    <CardDescription>
                      <ChartContainer config={chartConfig}>
                        <PieChart>
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
                            label={({
                              cx,
                              cy,
                              midAngle,
                              innerRadius,
                              outerRadius,
                              percent,
                              index,
                            }) => {
                              const RADIAN = Math.PI / 180;
                              const radius =
                                innerRadius + (outerRadius - innerRadius) * 0.5;
                              const x =
                                cx + radius * Math.cos(-midAngle * RADIAN);
                              const y =
                                cy + radius * Math.sin(-midAngle * RADIAN);
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  fill="black"
                                  textAnchor="middle"
                                  dominantBaseline="central"
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
                                fill={`var(--color-${item.category.replace(/\s+/g, "-")})`}
                              />
                            ))}
                          </Pie>
                          <ChartLegend
                            content={<ChartLegendContent nameKey="category" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                          />
                        </PieChart>
                      </ChartContainer>
                    </CardDescription>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center mt-10">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                No expenses found
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Start adding your expenses below or at the transactions page to
                see the overview.
              </p>
              <ModalButton newExpense={() => console.log('New expense added')}/>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl mt-10 ml-2">
          <Skeleton className="h-[48px] w-[350px] mb-6" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                className="rounded-xl h-[150px] w-[330px]"
              />
            ))}
          </div>
          <Skeleton className="mt-4 rounded-xl h-[531px] w-[1368px]" />
        </div>
      )}
    </>
  );
};
export default Dashboard;
