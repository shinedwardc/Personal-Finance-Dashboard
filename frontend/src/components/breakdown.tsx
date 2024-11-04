import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale } from "chart.js";
import { useEffect, useState, useMemo } from "react";
import { ExpenseInterface, PlaidResponse } from "../interfaces/interface";
import Form from "./Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement,ArcElement, Tooltip, Legend, RadialLinearScale);

const Breakdown = ({data, setData, isDataLoading, plaidBalance} : {data: ExpenseInterface[], setData: React.Dispatch<React.SetStateAction<ExpenseInterface[]>>, isDataLoading: boolean, plaidBalance: PlaidResponse}) => {
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {},
  );
  const [total, setTotal] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [date, setDate] = useState(new Date());
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [graphType, setGraphType] = useState<string>("bar");

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
      const totalCost = Object.values(totals).reduce((sum, cost) => sum + cost, 0);
      setTotal(totalCost);
    } catch (error) {
      console.error("Error calculating totals:", error);
    }
  }
  
  const fetchCategories = () => {
    const newCategories = new Set<string>();
    for (const expense of data) {
      const categoryName = expense.category;
      newCategories.add(categoryName);
    }
    console.log('newCategories: ', newCategories)
    setCategories(Array.from(newCategories));
  }


  const calculateTotalByCategory = async (
    expenses: ExpenseInterface[],
    date : Date | null = null
  ): Promise<Record<string, number>> => {
    const totals: Record<string, number> = {};

    console.log("expenses", expenses);
    for (const expense of expenses) {
      if (date && new Date(expense.date).toDateString() < new Date(date).toDateString()) {
        continue; // Skip expenses before the date
      }
      const categoryName = expense.category;
      const amount = parseFloat(expense.amount.toString())
      //console.log("amount", amount);

      setTotal((prevTotal) => (prevTotal + amount));
  
      totals[categoryName] = (totals[categoryName] || 0) + amount;
    }
    //console.log(Object.keys(categoryTotals));
    //console.log(Object.values(categoryTotals));
    return totals;
  };

  const handleGraphSelect = (e : React.FormEvent) => {
    const element = e.target as HTMLInputElement;
    setGraphType(element.value);
  }
  
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
          data: Object.values(categoryTotals).map(amount => parseFloat(amount.toFixed(2))),
          backgroundColor: Object.keys(categoryTotals).map(
            (_, index) => `rgba(${200 + index * 20}, ${50 + index * 10}, ${100 + index * 15}, 0.6)`,
          ),
          borderColor: Object.keys(categoryTotals).map(
            (_, index) => `rgba(${220 + index * 10}, ${70 + index * 5}, ${120 + index * 10}, 1)`,
          ),
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
          color: '#ff3333'
        },
        legend: {
          position: "top" as const,
          labels: {
            color: '#ff3333'
          }
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
            color: '#ff3333'
          }
        },
        x: {
          ticks: {
            color: '#ff3333'
          }
        }
      }
    };
    //console.log(graphType);
    
    switch (graphType) {
      case "bar":
        return <Bar className="mt-6 p-1 h-[400px]" data={chartData} options={options} />;
      case "line":
        return <Line className="mt-6 p-1 h-[400px]" data={chartData} options={options} />;
      default:
        return null;
    }
  }, [categoryTotals, graphType]);


  const handleDateSelect = async (date : Date) => {
    setDate(date);
    const filtered = await calculateTotalByCategory(data,date);
    console.log(filtered);
  }

  const refetchExpenses = async (newExpense : ExpenseInterface) => {
    try {
      console.log("newExpense", newExpense);
      setData((prevData) => {
        const combinedData = [...prevData, newExpense];
        return combinedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });
    } catch (error) {
      console.error("Failed to refetch expenses:", error);
    }
  };  

  return (
    <>
        <div>
          {!isDataLoading ? (
            <div className="flex flex-col w-full">
              <div className="flex justify-start mb-7">
                <h1 className="text-5xl font-ubuntu text-lime-400">Expense Tracker</h1>
              </div>
              <div className="flex flex-row justify-between w-full space-x-4">
                <div className="flex flex-col justify-start w-1/3 bg-green-800 rounded-xl">
                  <div className="w-full">
                    <h2 className="text-center mt-3 mb-3 font-ubuntu text-2xl">Expense summary</h2>
                    <div className="flex flex-row justify-between text-center">
                      <div className="flex-1">
                        <label htmlFor="graph-select">Graph style: </label>
                        <br/>
                        <select className="select select-bordered select-sm" id="graph-select" value={graphType} onChange={handleGraphSelect}>
                          <option value="bar">Bar graph</option>
                          <option value="line">Line graph</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label>From date: </label>
                        <DatePicker 
                          className="w-2/3 mt-1 text-center"
                          selected={date} 
                          onChange={(newDate: Date | null) => {
                            if (newDate) {
                              handleDateSelect(newDate);
                            }
                          }} 
                        />
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
                      {!categoryLoading && categories.length > 0 && categories.map((category) => (
                        <tr key={category}>
                          <td className="border-r">{category}</td>
                          <td>{categoryTotals[category] ? categoryTotals[category].toFixed(2) : 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="w-1 bg-slate-300 px-1 mx-2"></div>
                <div className="ml-2 w-1/3 bg-teal-800 rounded-xl">
                  <div className="card glass w-60 mt-4 ml-4 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="card-body items-center text-center">
                        <h5 className="text-sm mb-2">Total Expenses</h5>
                        <h1 className="text-3xl font-bold">${total.toFixed(2)}</h1>
                      </div>
                    </div>
                    <div className="card glass w-60 mt-4 ml-4 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="card-body items-center text-center">
                        <h5 className="text-sm mb-2">Current total account balance</h5>
                        <h1 className="text-3xl font-bold">${balance}</h1>
                      </div>
                    </div>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button className="btn btn-success" onClick={()=>document.getElementById('my_modal_1').showModal()}>Add new expense</button>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box">
                    {/* Close Button */}
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className=''>
                      <Form onFormSubmit={refetchExpenses}/>
                    </div>                   
                  </div>
                </dialog>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
      </div>
    </>
  );
};
export default Breakdown;
