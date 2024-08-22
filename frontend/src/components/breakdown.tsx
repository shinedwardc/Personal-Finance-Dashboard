import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { getExpense } from "../api/api";
import { ExpenseInterface } from "../interfaces/interface";

ChartJS.register(ArcElement, Tooltip, Legend);

const Breakdown = () => {
  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const list = await getExpense();
        setExpenses(list);
      } catch (error) {
        console.error(error);
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

  return (
    <>
      <h1 className="font-semibold font-ubuntu">Welcome!</h1>
      <div className="mt-6">
        <h2 className="text-center mt-3 font-ubuntu">Expense summary</h2>
        <Pie data={data} options={options} />
      </div>
    </>
  );
};
export default Breakdown;
