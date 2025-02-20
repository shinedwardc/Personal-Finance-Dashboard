import { useEffect, useState, useMemo, useRef } from "react";
import { useData } from "@/App";
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
  ExpenseInterface,
  PlaidResponse,
  Settings,
} from "../interfaces/interface";
import Form from "./Form";

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

const Breakdown = ({
  //data,
  //setData,
  settings,
  //isDataLoading,
  plaidBalance,
}: {
  //data: ExpenseInterface[];
  settings: Settings;
  //setData: React.Dispatch<React.SetStateAction<ExpenseInterface[]>>;
  //isDataLoading: boolean;
  plaidBalance: PlaidResponse;
}) => {
  const { data, setData, isDataLoading } = useData();
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
    <div className="w-2/3 ml-36 mt-16">
      <div className="flex flex-col w-full">
        <div className="flex justify-start mb-7">
          <h1 className="text-5xl font-ubuntu text-lime-400">
            Expense Tracker
          </h1>
        </div>
        {!isDataLoading ? (
          data.length > 0 ? (
            <div>
              <div className="flex flex-row justify-between w-full space-x-4">
                <div className="flex flex-col p-2 justify-start w-1/3 bg-green-800 rounded-xl">
                  <div className="w-full">
                    <h2 className="text-center mt-3 mb-3 font-ubuntu text-2xl">
                      Expense overall summary
                    </h2>
                    <div className="flex flex-row justify-between text-center">
                      <div className="flex-1">
                        <label htmlFor="graph-select">Graph style: </label>
                        <br />
                        <select
                          className="select select-bordered select-sm"
                          id="graph-select"
                          value={graphType}
                          onChange={handleGraphSelect}
                        >
                          <option value="bar">Bar graph</option>
                          <option value="line">Line graph</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      {graph}
                    </div>
                  </div>
                </div>
                <div className="w-1 bg-slate-300 px-1 mx-2"></div>
                <div className="overflow-x-auto w-1/3 bg-emerald-800 rounded-xl">
                  <table className="table">
                    <thead className="text-center">
                      <tr>
                        <th className="border-r">Category</th>
                        <th>Amount sum</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {!categoryLoading &&
                        categories.length > 0 &&
                        categories.map((category) => (
                          <tr key={category}>
                            <td className="border-r">{category}</td>
                            <td>
                              {categoryTotals[category]
                                ? categoryTotals[category].toFixed(2)
                                : 0}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="w-1 bg-slate-300 px-1 mx-2"></div>
                <div className="w-1/3 bg-teal-800 rounded-xl flex flex-col justify-evenly">
                  <div className="flex justify-center">
                    <div className="card glass w-60 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="card-body items-center text-center">
                        <h5 className="text-sm mb-2">Total spent</h5>
                        <h1 className="text-3xl font-bold">
                          ${total.toFixed(2)}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="card glass w-60 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="card-body items-center text-center">
                        <h5 className="text-sm mb-2">Monthly budget</h5>
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
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="card glass w-60 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="card-body items-center text-center">
                        <h5 className="text-sm mb-2">
                          Current total account balance
                        </h5>
                        <h1 className="text-3xl font-bold">${balance}</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
          ) : (
            <div>
              <h2 className="font-semibold font-ubuntu">
                Welcome to Expense Tracker! Add some new expenses below or go to
                the Expenses page to add some
              </h2>
            </div>
          )
        ) : (
          <div className="flex flex-row justify-between items-stretch w-full">
            <div className="skeleton w-1/3 mr-4 h-[36.5rem]"></div>
            <div className="skeleton w-1/3 ml-4 mr-4 h-[36.5rem]"></div>
            <div className="skeleton w-1/3 ml-4 h-[36.5rem]"></div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Breakdown;
