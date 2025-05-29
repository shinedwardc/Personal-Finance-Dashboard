import Expense from "./Expense";
import { useState, useEffect } from "react";
import { useExpenseContext } from "@/hooks/useExpenseContext";
import { ExpenseInterface } from "../interfaces/expenses";
import Form from "./Form";
import Recurring from "./Recurring";
import axios from "axios";
import { format, compareAsc } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import MonthPicker from "./ui/month-picker";
import { toast, Bounce } from "react-toastify";

//https://flowbite.com/docs/components/spinner/#progress-spinner

const List = (/*{
  //data,
  //isLoading,
  //setData,
}: {
  //data: ExpenseInterface[];
  //isLoading: boolean;
  //setData: React.Dispatch<React.SetStateAction<ExpenseInterface[]>>;
}*/) => {
  //const [search, setSearch] = useState<string>("");
  //const [useFilteredData, setUseFilteredData] = useState<boolean>(false);
  //const [filteredData, setFilteredData] = useState<ExpenseInterface[]>([]);

  const { data, setData, isDataLoading } = useExpenseContext();
  const [month, setMonth] = useState<Date>(new Date());

  useEffect(() => {
    console.log(data.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getFullYear() === month.getFullYear() &&
        expenseDate.getMonth() === month.getMonth()
      );
    }))
  },[month]);

  const refetchExpenses = async (newExpense: ExpenseInterface) => {
    try {
      console.log(newExpense);
      setData((prevData) => {
        const combinedData = [...prevData, newExpense];
        return combinedData.sort(
          (a, b) => compareAsc(new Date(a.date), new Date(b.date)),
        );
      });
      toast.success(`Added monthly expense`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Failed to refetch expenses:", error);
    }
  };

  const handleDeleteTask = async (expenseId: number | string) => {
    const response = await axios.delete(
      `http://localhost:8000/expenses/${expenseId}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    if (response.status === 204) {
      console.log("Expense deleted successfully");
      setData((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId),
      );
      toast.success("Successfully deleted expense", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      console.error("Failed to delete expense");
    }
  };

  /*const handleSearch = (e : React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    let searchedData = data;
    if (query.length > 0){
      setUseFilteredData(true);
      const lowerCaseQuery = query.toLowerCase();
      searchedData = searchedData.filter((expense) => !Array.isArray(expense.category) ? 
                                          expense.name?.toLowerCase().includes(lowerCaseQuery) : expense.category.name.toLowerCase().includes(lowerCaseQuery))
      setFilteredData(searchedData);
    }
    else{
      setUseFilteredData(false);
    }
  }*/

  return (
    <>
      {!isDataLoading ? (
        data.length > 0 ? (
          <>
            <div className="mt-16"></div>
            <div className="mb-2">
              <h1 className="text-xl antialiased dark:text-white">Full detailed list</h1>
            </div>
            <div>
              <MonthPicker
                currentMonth={month}
                onMonthChange={(newMonth) => {
                  setMonth(newMonth);
                  console.log("Selected month:", format(newMonth, "MMMM yyyy"));
                  // refetchExpenses();
                }}
              />
            </div>
            <div className="mb-2 border-cyan-500 overflow-x-auto dark:text-white">
              {/*<div className="mb-4 flex justify-center">
                <label className="input input-bordered flex items-center w-64 gap-2">
                  <input type="text" className="grow" placeholder="Search" value={search} onChange={handleSearch}/>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                      fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd" />
                  </svg>
                </label>
              </div>*/}
              <Table>
                <TableCaption>Withdrawals / Deposits</TableCaption>
                <TableHeader>
                  <TableRow>
                    {[
                      "Name",
                      "Category",
                      "Amount",
                      "Currency",
                      "Date",
                      "Delete",
                    ].map((header) => (
                      <TableHead
                        key={header}
                        className="text-center"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-lg font-ubuntu font-bold text-center">{expense.name}</TableCell>
                      <TableCell className="text-base text-center">
                        {typeof expense.id === "number" ? expense.category : "*" + expense.category}
                      </TableCell>
                      <TableCell className="text-base text-center">
                        {expense.amount < 0 ? "+" + (expense.amount * -1).toString() : expense.amount * -1}
                        {/*currencies[expense.currency as keyof Currency]*/}
                      </TableCell>
                      <TableCell className="text-base text-center">
                        {expense.currency.toUpperCase()}
                      </TableCell>
                      <TableCell className="text-base text-center">
                        {expense.date.toString().substring(0,10)}
                      </TableCell>
                      <TableCell>
                        <button 
                          className={`btn ${typeof expense.id !== "number" ? "btn-disabled" : "btn-error"} btn-tiny`}
                          onClick={() => handleDeleteTask(expense.id)}
                        >
                          {typeof expense.id !== "number" ? "Plaid" : "Delete"}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="relative right-64 text-sm dark:text-white">
              <p>*: Expenses made from Plaid</p>
            </div>
            <div className="my-4 p-4 border border-green-800 w-1/3">
              <Form onFormSubmit={refetchExpenses} />
            </div>
            <div className="dark:text-slate-200">
              --- OR ---
            </div>
            <div className="my-4 p-4 border border-green-800 dark:text-white">
              <Recurring onFormSubmit={refetchExpenses} />
            </div>
          </>
        ) : (
          <>
            <div>
              <p>No expenses! Add some</p>
            </div>
            <div className="mb-8">
              <Form onFormSubmit={refetchExpenses} />
            </div>
          </>
        )
      ) : (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white-900"></div>
        </div>
      )}
    </>
  );
};

export default List;
