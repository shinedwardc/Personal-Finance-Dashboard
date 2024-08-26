import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { getExpense, getUserName } from "../api/api";
import { ExpenseInterface } from "../interfaces/interface";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Breakdown = () => {
  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {},
  );
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
        setUsername(username);
      } catch (error) {
        console.error(error);
      } finally {
        finishLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    //console.log(expenses);
    if (expenses.length > 0) {
      const totals = calculateTotalByCategory(expenses);
      setCategoryTotals(totals);
    }
  }, [expenses]);

  const calculateTotalByCategory = (
    expenses: ExpenseInterface[],
  ): Record<string, number> => {
    const categoryTotals: Record<string, number> = {};

    expenses.forEach((expense) => {
      const categoryName = expense.category.name;
      const amount = parseFloat(expense.amount.toString());

      if (categoryTotals[categoryName]) {
        categoryTotals[categoryName] += amount;
      } else {
        categoryTotals[categoryName] = amount;
      }
    });

    return categoryTotals;
  };

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Total expense of category",
        data: Object.values(categoryTotals),
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
    console.log(graphType);
    switch (graphType) {
      case "pie":
        return <Pie className="mt-6" data={data} options={options} />
      case "bar":
        return <Bar className="mt-6" data={data} options={options}/>
      default:
        return null;
    }
  };

  return (
    <>
      {!loading ? (
        <>
          <h1 className="font-semibold font-ubuntu">Welcome, {username}!</h1>
          {expenses.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-center mt-3 font-ubuntu">Expense summary</h2>
              <label className="ml-12" htmlFor="graph-select">Choose a graph: </label>
              <select id="graph-select" value={graphType} onChange={handleGraphSelect}>
                <option value="pie">Pie graph</option>
                <option value="bar">Bar graph</option>
              </select>
              {graphType.length > 0 && generateGraph()}
            </div>
          ) : (
            <div className="mt-6">
              <h2>No expenses registered! Consider adding expenses in the expense page</h2>
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-8">
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
