import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { getExpense, getUserName } from "../api/api";
import { ExpenseInterface } from "../interfaces/interface";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Breakdown = () => {
  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {},
  );
  const [total, setTotal] = useState<number>(0);
  const [date, setDate] = useState(new Date());
  const [username, setUsername] = useState<string>("");
  const [graphType, setGraphType] = useState<string>("pie");
  const [loading, finishLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const [list, username] = await Promise.all([
          getExpense(),
          getUserName(),
        ]);
        setExpenses(list);
        if (list.length <= 0){
          finishLoading(false);
        }
        setUsername(username);
      } catch (error) {
        console.error(error);
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const totals = await calculateTotalByCategory(expenses);
          setCategoryTotals(totals);
          //console.log(totals);
          //console.log(expenses);
          let totalCost = 0;
          for (const cost of Object.values(totals)) {
            totalCost += cost;
          }
          setTotal(totalCost);
      } catch (error) {
        console.error(error);
      } finally {
        finishLoading(false);
      }
    }
    if (expenses.length > 0) {

      fetchTotals();
    }
  }, [expenses]);

  const calculateTotalByCategory = async (
    expenses: ExpenseInterface[],
    date : any = null
  ): Promise<Record<string, number>> => {
    const categoryTotals: Record<string, number> = {};
    const conversionRates: Record<string, number> = {}; // To cache conversion rates and avoid multiple requests
  
    const getConversionRate = async (currency: string) => {
      if (currency === "usd") return 1;
  
      if (conversionRates[currency]) return conversionRates[currency];
  
      try {
        const response = await axios.get(`http://localhost:8000/get-currency-exchange/${currency}/usd/`);
        const rate = parseFloat(response.data.rate);
        //console.log(response.data);
        conversionRates[currency] = rate;
        return rate;
      } catch (error) {
        console.error('Error with converting calculation: ', error);
        return 1; 
      }
    };
  
    for (const expense of expenses) {
      if (date && new Date(expense.start_date).toDateString() < new Date(date).toDateString()) {
        continue; // Skip expenses before the date
      }
      const categoryName = expense.category.name;
      const amount = parseFloat(expense.amount.toString());
      const currency = expense.currency;
  
      const conversionRate = await getConversionRate(currency);
      //console.log('conversion rate: ', conversionRate);
      const convertedAmount = amount * conversionRate;
      //console.log('converted amount: ', convertedAmount);

      setTotal((total) => total + conversionRate);
  
      if (categoryTotals[categoryName]) {
        categoryTotals[categoryName] += convertedAmount;
      } else {
        categoryTotals[categoryName] = convertedAmount;
      }
    }
    //console.log(Object.values(categoryTotals));
    return categoryTotals;
  };

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Total expense of category",
        data: Object.values(categoryTotals).map(amount => parseFloat(amount.toFixed(2))),
        backgroundColor: Object.keys(categoryTotals).map(
          (_, index) => `rgba(${index * 50}, ${index * 100}, 200, 0.2)`,
        ),
        borderColor: Object.keys(categoryTotals).map(
          (_, index) => `rgba(${index * 50}, ${index * 100}, 200, 1)`,
        ),
        borderWidth: 1,
        hoverOffset: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Expenses analysis by category",
      },
      legend: {
        position: "top" as const,
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
  };

  const handleGraphSelect = (e : React.FormEvent) => {
    const element = e.target as HTMLInputElement;
    setGraphType(element.value);
  }
  
  const generateGraph = () => {
    //console.log(graphType);
    switch (graphType) {
      case "pie":
        return <Pie className="mt-6" data={data} options={options} />
      case "bar":
        return <Bar className="mt-6" data={data} options={options}/>
      default:
        return null;
    }
  };

  const handleDateSelect = async (date) => {
    setDate(date);
    const filtered = await calculateTotalByCategory(expenses,date);
    console.log(filtered);
  }

  return (
    <>
      {!loading ? (
        <>
          <h1 className="text-5xl mb-10">Expense Tracker</h1>
          <h2 className="text-3xl font-ubuntu">Welcome, {username}!</h2>
          {expenses.length > 0 ? (
            <>
              <div className="mt-6">
                <h2 className="text-center mt-3 mb-3 font-ubuntu text-2xl">Expense summary</h2>
                <div className="flex flex-row justify-center text-center">
                  <div className="basis-1/2">
                    <label htmlFor="graph-select">Graph style: </label>
                    <br/>
                    <select className="select select-bordered select-sm" id="graph-select" value={graphType} onChange={handleGraphSelect}>
                      <option value="pie">Pie graph</option>
                      <option value="bar">Bar graph</option>
                    </select>
                  </div>
                  <div className="basis-1/2 mt-1">
                    <label>From date: </label>
                    <DatePicker selected={date} onSelect={handleDateSelect} />
                  </div>
                </div>
                {graphType.length > 0 && generateGraph()}
              </div>
              <div className="mt-1">
                <h4 className="text-center text-sm">Total spent: {total}$</h4>
              </div>
            </>
          ) : (
            <div className="mt-6">
              <h2>No expenses registered! Consider adding expenses in the expense page</h2>
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-80">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};
export default Breakdown;
