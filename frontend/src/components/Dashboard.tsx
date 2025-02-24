import { useEffect, useState, useMemo, useRef } from "react";
import { useExpenseContext } from "@/hooks/useExpenseContext";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import Modal from "react-modal";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
  ExpenseInterface,
  PlaidResponse,
  Settings,
} from "../interfaces/interface";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
);

const Dashboard = ({
    plaidBalance,
    settings,
}: {
    plaidBalance: PlaidResponse;
    settings: Settings;
}) => {
  const { data, setData, isDataLoading } = useExpenseContext();
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {},
  );
  const [total, setTotal] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  //const [date, setDate] = useState(new Date());
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [graphType, setGraphType] = useState<string>("bar");
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  //const modalRef = useRef<HTMLDialogElement>(null);
  Modal.setAppElement("#root");

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
      console.log("plaidBalance", plaidBalance);
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
    console.log("newCategories: ", newCategories);
    setCategories(Array.from(newCategories));
  };

  const calculateTotalByCategory = async (
    expenses: ExpenseInterface[],
  ): Promise<Record<string, number>> => {
    const totals: Record<string, number> = {};
    setTotal(0);
    console.log("expenses", expenses);
    for (const expense of expenses) {
      const amount = parseFloat(expense.amount.toString());
      if (amount < 0) continue;
      const categoryName = expense.category;

      setTotal((prevTotal) => prevTotal + amount);

      totals[categoryName] = (totals[categoryName] || 0) + amount;
    }
    return totals;
  };

  const handleGraphSelect = (e: React.FormEvent) => {
    const element = e.target as HTMLInputElement;
    setGraphType(element.value);
  };

  const graph = useMemo(() => {
    if (Object.keys(categoryTotals).length === 0) {
      return null;
    }
    const chartData = {
      labels: Object.keys(categoryTotals),
      maintainAspectRatio: false,
      datasets: [
        {
          label: "Total expense of category",
          data: Object.values(categoryTotals).map((amount) =>
            parseFloat(amount.toFixed(2)),
          ),
          backgroundColor: "#00cd00",
          borderColor: "#00cd00",
          borderWidth: 1,
          hoverOffset: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Expenses analysis by category",
          color: "#00cd00",
        },
        legend: {
          position: "top" as const,
          labels: {
            color: "white",
          },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              const dataset = tooltipItem.dataset;
              const label = dataset.label || "";
              const value = dataset.data[tooltipItem.dataIndex];
              return `${label}: $${value.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "#00cd00",
          },
        },
        x: {
          ticks: {
            color: "#00cd00",
          },
        },
      },
    };
    //console.log(graphType);

    switch (graphType) {
      case "bar":
        return (
          <Bar
            className="mt-6 p-1 h-[400px]"
            data={chartData}
            options={options}
          />
        );
      case "line":
        return (
          <Line
            className="mt-6 p-1 h-[400px]"
            data={chartData}
            options={options}
          />
        );
      default:
        return null;
    }
  }, [categoryTotals, graphType]);

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
    <div className="mt-5 ml-2">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl h-[150px]">
          <CardHeader>
            <CardTitle>Total spent</CardTitle>
            <CardDescription>
              Total amount spent in transactions (USD $)
            </CardDescription>
          </CardHeader>
          <CardContent className="bt-[-6]">
            <p>${total.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl h-[150px]">
          <CardHeader>
            <CardTitle>Monthly budget</CardTitle>
            <CardDescription>Manage your spending by setting a limit</CardDescription>
          </CardHeader>
          <CardContent>
          {settings.monthlyBudget !== null ? (
                <>
                <h1 className="text-3xl font-bold">
                ${settings.monthlyBudget}
                </h1>
                <h3
                className={`text-sm ${settings.monthlyBudget - Number(total.toFixed(2)) < 0 ? "text-red-400" : "text-green-400"}`}
                >
                {settings.monthlyBudget - Number(total.toFixed(2)) < 0
                    ? `Spent over monthly budget limit by ${Math.abs(settings.monthlyBudget - Number(total.toFixed(2))).toFixed(2)}$`
                    : `Amount left until budget limit ${(settings.monthlyBudget - Number(total.toFixed(2))).toFixed(2)}$`}
                </h3>
                </>
            ) : (
                <p className="text-sm text-red-400">
                Add a budget limit in profile settings
                </p>
        )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Current balance</CardTitle>
                <CardDescription>View your current account balance</CardDescription>
            </CardHeader>
            <CardContent>
                <p>${balance.toFixed(2)}</p>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most used category</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
