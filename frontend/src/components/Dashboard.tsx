import { useEffect, useState } from "react";
import { useExpenseContext } from "@/hooks/useExpenseContext";
import { useCalendarContext } from "@/hooks/useCalendarContext";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import Modal from "react-modal";
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
} from "@/components/ui/chart";
import Form from "./Form";
import { ExpenseInterface } from "../interfaces/expenses";
import { PlaidResponse } from "../interfaces/plaid";
import { Settings } from "../interfaces/settings";

const Dashboard = ({
  plaidBalance,
  settings,
}: {
  plaidBalance: PlaidResponse;
  settings: Settings;
}) => {
  const { data, setData, isDataLoading } = useExpenseContext();
  const { monthlySpent } = useCalendarContext();
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {},
  );
  const [total, setTotal] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  //const [date, setDate] = useState(new Date());
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [topSpendingCategories, setTopSpendingCategories] = useState<string[]>([]);
  const [graphData, setGraphData] = useState<
    Array<{ Category: string; Total: number }>
  >([]);
  const [graphType, setGraphType] = useState<string>("bar");
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  //const modalRef = useRef<HTMLDialogElement>(null);
  Modal.setAppElement("#root");
  //console.log(settings);

  useEffect(() => {
    const initialize = async () => {
      try {
        await calculateTotals();
        fetchCategories();
        setCategoryLoading(false);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    initialize();
  }, [data]);

  useEffect(() => {
    if (plaidBalance) {
      //console.log("plaidBalance", plaidBalance);
      let balance = 0;
      for (const account of plaidBalance.accounts) {
        balance += account.balances.available;
      }
      console.log("balance", balance);
      setBalance(balance);
    }
  }, [plaidBalance]);

  const calculateTotals = async () => {
    try {
      const totals = await calculateTotalByCategory(data);
      setCategoryTotals(totals);
      const totalCost = Object.values(totals).reduce(
        (sum, cost) => sum + cost,
        0,
      );
      setTotal(totalCost);
    } catch (error) {
      console.error("Error calculating totals:", error);
    }
  };

  const fetchCategories = () => {
    const newCategories = new Set<string>();
    for (const expense of data) {
      const categoryName = expense.category;
      newCategories.add(categoryName);
    }
    //console.log("newCategories: ", newCategories);
    setCategories(Array.from(newCategories));
  };

  const calculateTotalByCategory = async (
    expenses: ExpenseInterface[],
  ): Promise<Record<string, number>> => {
    const totals: Record<string, number> = {};
    setTotal(0);
    //console.log("expenses", expenses);
    for (const expense of expenses) {
      const amount = parseFloat(expense.amount.toString());
      if (amount < 0) continue;
      const categoryName = expense.category;

      setTotal((prevTotal) => prevTotal + amount);

      totals[categoryName] = (totals[categoryName] || 0) + amount;
    }
    const sortedCategoryTotals = Object.entries(totals).sort(
      ([,a], [,b]) => b - a,
    )
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
    
    const graphData = [];
    for (const category of Object.keys(totals).sort()) {
      const totalObj = {
        Category: category,
        Total: totals[category],
      };
      graphData.push(totalObj);
    }
    //console.log(graphData);
    setGraphData(graphData);
    
    return totals;
  };

  const handleGraphSelect = (e: React.FormEvent) => {
    const element = e.target as HTMLInputElement;
    setGraphType(element.value);
  };

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  /*const handleDateSelect = async (date: Date) => {
    setDate(date);
    const filtered = await calculateTotalByCategory(data, date);
    console.log(filtered);
  };*/

  const refetchExpenses = async (newExpense: ExpenseInterface) => {
    try {
      console.log("newExpense", newExpense);
      setData((prevData) => {
        const combinedData = [...prevData, newExpense];
        return combinedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      });
    } catch (error) {
      console.error("Failed to refetch expenses:", error);
    }
    /*if (modalRef.current) {
      modalRef.current.close();
    }*/
    setIsOpen(false);
  };

  return (
    <>
      {!isDataLoading ? (
        <div className="mt-10 ml-2">
          <h1 className="text-[#6abeb4] text-5xl mb-6">Overview</h1>
          <p className="text-gray-300 mb-2">
            Start money management with a birds-eye view of your expenses
          </p>
          {data.length > 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-xl h-[150px] w-[330px]">
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
                <Card className="rounded-xl h-[150px] w-[330px]">
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
                <Card className="rounded-xl h-[150px] w-[330px]">
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
                <Card className="rounded-xl h-[150px] w-[330px]">
                  <CardHeader>
                    <CardTitle>Remaining budget</CardTitle>
                    <CardDescription>
                      Monthly spent so far / Set monthly budget
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {settings.monthlyBudget !== null ? (
                      <>
                        <h1 className={`text-sm font-semibold ${settings.monthlyBudget - Number(total.toFixed(2)) < 0 ? "text-red-400" : "text-green-200"}`}>
                          ${monthlySpent} / ${settings.monthlyBudget}
                        </h1>
                        <h3
                          className={`text-sm ${settings.monthlyBudget - Number(total.toFixed(2)) < 0 ? "text-red-400" : "text-yellow-200"}`}
                        >
                          {settings.monthlyBudget - Number(total.toFixed(2)) < 0
                            ? `Spent over monthly budget limit by ${Math.abs(settings.monthlyBudget - Number(total.toFixed(2))).toFixed(2)}$`
                            : `You have ${(settings.monthlyBudget - Number(total.toFixed(2))).toFixed(2)}$ left until budget limit`}
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
                    Overview
                  </h1>
                </div>
                <div className="flex flex-row gap-4 mt-4">
                  <Card className="w-1/2 rounded-xl">
                    <CardHeader>
                      <CardTitle className="font-normal">
                        Spending by category
                      </CardTitle>
                    </CardHeader>
                    <CardDescription>
                      <ChartContainer config={chartConfig}>
                        <BarChart accessibilityLayer data={graphData}>
                          <XAxis
                            dataKey="Category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                          />
                          <YAxis scale="auto" tickCount={5} unit={"$"} />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                          />
                          <Bar
                            dataKey="Total"
                            fill="var(--color-desktop)"
                            radius={8}
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardDescription>
                  </Card>
                  <Card className="w-1/2 rounded-xl">
                    <CardHeader>
                      <CardTitle className="font-normal"></CardTitle>
                    </CardHeader>
                    <CardDescription>
                      <ChartContainer config={chartConfig}>
                        <BarChart accessibilityLayer data={graphData}>
                          <XAxis
                            dataKey="Category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                          />
                          <YAxis scale="auto" tickCount={5} unit={"$"} />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                          />
                          <Bar
                            dataKey="Total"
                            fill="var(--color-desktop)"
                            radius={8}
                          />
                        </BarChart>
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
                Start adding your expenses below or at the transactions page to see the overview.
              </p>
              <div className="flex justify-center mt-8">
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button
                  className="btn btn-success"
                  onClick={() => setIsOpen(true)}
                >
                  Add new expense
                </button>
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={() => setIsOpen(false)}
                  className="modal-box absolute top-[35%] left-[38.7%] dark:bg-black"
                >
                  <div className="">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsOpen(false)}>
                      ✕
                    </button>
                    <div>
                      <Form onFormSubmit={refetchExpenses} />
                    </div>
                  </div>                 
                </Modal>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl mt-10 ml-2">
          <Skeleton className="h-[48px] w-[350px] mb-6" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_,index) => (
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
