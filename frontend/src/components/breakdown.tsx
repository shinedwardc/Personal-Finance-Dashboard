import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, RadialLinearScale } from "chart.js";
import { useEffect, useState, useMemo } from "react";
import { ExpenseInterface } from "../interfaces/interface";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement,ArcElement, Tooltip, Legend, RadialLinearScale);

const Breakdown = ({data, isDataLoading} : {data: ExpenseInterface[], isDataLoading: boolean}) => {
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {},
  );
  const [total, setTotal] = useState<number>(0);
  const [date, setDate] = useState(new Date());
  const [graphType, setGraphType] = useState<string>("bar");

  useEffect(() => {
    const calculateTotals = async () => {
      try {
        const totals = await calculateTotalByCategory(data);
        setCategoryTotals(totals);
        let totalCost = 0;
        for (const cost of Object.values(totals)) {
          totalCost += cost;
        }
        setTotal(totalCost);
      } catch (error) {
        console.error(error);
      }
    }
    calculateTotals();
  }, [data]);


  const calculateTotalByCategory = async (
    expenses: ExpenseInterface[],
    date : any = null
  ): Promise<Record<string, number>> => {
    const totals: Record<string, number> = {};

    console.log("expenses", expenses);
    for (const expense of expenses) {
      if (date && new Date(expense.start_date).toDateString() < new Date(date).toDateString()) {
        continue; // Skip expenses before the date
      }
      const categoryName = Array.isArray(expense.category) ? expense.category[0] : expense.category.name;
      const amount = parseFloat(expense.amount.toString());

      setTotal((total) => total + amount);
  
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
      responsive: false,
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
    //console.log(graphType);
    
    switch (graphType) {
      case "bar":
        return <Bar className="mt-6" data={chartData} options={options} />;
      case "line":
        return <Line className="mt-6" data={chartData} options={options} />;
      default:
        return null;
    }
  }, [categoryTotals, graphType]);


  const handleDateSelect = async (date) => {
    setDate(date);
    const filtered = await calculateTotalByCategory(data,date);
    console.log(filtered);
  }


  return (
    <>
        <div>
          {!isDataLoading ? (
            <div className="flex flex-col w-full">
              <div className="flex justify-start mb-5">
                <h1 className="text-5xl font-ubuntu">Expense Tracker</h1>
              </div>
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col justify-start w-1/2">
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
                      <div className="flex-1 mt-1">
                        <label>From date: </label>
                        <DatePicker selected={date} onSelect={handleDateSelect} />
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                    {graph}
                    </div>
                  </div>
                </div>
                <div className="w-1 bg-slate-300 px-1 mx-2"></div>
                <div className="overflow-x-auto mt-10 ml-4">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Job</th>
                        <th>Favorite Color</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Cy Ganderton</td>
                        <td>Quality Control Specialist</td>
                        <td>Blue</td>
                      </tr>
                      <tr>
                        <td>Hart Hagerty</td>
                        <td>Desktop Support Technician</td>
                        <td>Purple</td>
                      </tr>
                      <tr>
                        <td>Brice Swyre</td>
                        <td>Tax Accountant</td>
                        <td>Red</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
      </div>
    </>
  );
};
export default Breakdown;
