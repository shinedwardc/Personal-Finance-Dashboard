import { useState, useMemo } from "react";
import { useExpenseContext } from "@/hooks/useExpenseContext";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import Form from "./Form";
import Recurring from "./Recurring";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import MonthPicker from "./ui/month-picker";
import ModalButton from "./ui/modal-button";
import { toast, Bounce } from "react-toastify";
import { TbSortAscendingLetters } from "react-icons/tb";
import { TbSortDescendingLetters } from "react-icons/tb";
import { ExpenseInterface } from "@/interfaces/expenses";

//https://flowbite.com/docs/components/spinner/#progress-spinner

const List = () => {
  //const [search, setSearch] = useState<string>("");
  const [monthAndYear, setMonthAndYear] = useState<Date>(new Date());
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"ascending" | "descending">("ascending");

  const { deleteExpenseMutate } = useExpenseContext();

  const { data: monthlyExpenses, isLoading: isMonthlyExpensesLoading } =
    useMonthlyExpenses(monthAndYear);

  //const [list, setList] = useState<ExpenseInterface[] | undefined>(undefined);

  const sortedExpenses = useMemo(() => {
    if (!monthlyExpenses) return [];
    return [...monthlyExpenses].sort((a, b) => {
      if (sortDirection === "ascending"){
        return a[sortBy].toString().localeCompare(b[sortBy].toString());
      }
      return b[sortBy].toString().localeCompare(a[sortBy].toString());
    });
  }, [monthlyExpenses, sortBy, sortDirection]);

  const onNewExpense = async () => {
    try {
      toast.success("Succesfully added expense", {
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
      toast.error("Failed to add expense", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });      
      console.error("Failed to refetch expenses:", error);
    }
  };

  const handleDeleteTask = async (expenseId: number | string) => {
    try {
      deleteExpenseMutate(expenseId);
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
    } catch (error) {
      toast.error("Failed to add expense", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });     
      console.error("Failed to delete expense ", expenseId, error);
    }

  };

  const handleSortChange = (value : string) => {
    setSortBy(value);
    /*if (monthlyExpenses){
      monthlyExpenses.sort((a,b) => a[value].localeCompare(b[value]));
    }*/
    /*if (monthlyExpenses && value === "name") {
      monthlyExpenses.sort((a,b) => a.name.localeCompare(b.name));
    }
    else if (monthlyExpenses && value === "date") {
      monthlyExpenses.sort((a,b) => a.date.localeCompare(b.date));
    }*/
  }
  
  const handleDirectionChange = (value : string) => {
    setSortDirection(value);
  }

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
      {!isMonthlyExpensesLoading ? (
        sortedExpenses && sortedExpenses.length > 0 ? (
          <>
            <div className="mt-16"></div>
            <div className="mb-2 w-1/3 flex flex-row justify-around items-center">
              <h1 className="text-3xl antialiased font-semibold dark:text-white">
                Transactions
              </h1>
              <ModalButton newExpense={onNewExpense}/>
            </div>
            <div className="flex flex-row w-1/2 items-center gap-2">
              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                Sort by
              </label>
              <Select onValueChange={handleSortChange} defaultValue="date">
                <SelectTrigger className="w-1/4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={handleDirectionChange} defaultValue="ascending">
                <SelectTrigger className="w-1/4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ascending">
                    <span className="flex flex-row items-center gap-1">
                      Ascending <TbSortAscendingLetters/>
                    </span>
                  </SelectItem>
                  <SelectItem value="descending">
                    <span className="flex flex-row items-center gap-1">
                      Descending <TbSortDescendingLetters/>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>             
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
                <TableHeader>
                  <TableRow>
                    {[
                      "Date",
                      "Description",
                      "Category",
                      "Amount",
                      //"Currency",
                      "Actions",
                    ].map((header) => (
                      <TableHead key={header} className="text-center">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedExpenses.map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-base text-center">
                        {expense.date.toString().substring(0, 10)}
                      </TableCell>
                      <TableCell className="text-lg font-ubuntu font-bold text-center">
                        {expense.name}
                      </TableCell>
                      <TableCell className="text-base text-center">
                        {typeof expense.id === "number"
                          ? expense.category
                          : "*" + expense.category}
                      </TableCell>
                      <TableCell className={`text-base text-center ${expense.amount > 0 ? "text-red-500" : "text-green-500"}`}>
                        {expense.amount < 0
                          ? "+" + (expense.amount * -1).toString()
                          : expense.amount * -1}$
                        {/*currencies[expense.currency as keyof Currency]*/}
                      </TableCell>
                      {/*<TableCell className="text-base text-center">
                        {expense.currency.toUpperCase()}
                      </TableCell>*/}
                      <TableCell className="flex justify-center">
                        <button
                          className={`btn ${typeof expense.id !== "number" ? "btn-disabled" : "btn-error"} btn-tiny text-center`}
                          onClick={() => handleDeleteTask(expense.id)}
                        >
                          {typeof expense.id !== "number" ? "Plaid" : "Delete"}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div>
                <MonthPicker
                  currentMonth={new Date(monthAndYear)}
                  onMonthChange={(newDate) => {
                    setMonthAndYear(newDate);
                  }}
                />
              </div>
            </div>
            <div className="mt-4 dark:text-slate-200">--- OR ---</div>
            <div className="my-4 p-4 border border-green-800 dark:text-white">
              <Recurring onFormSubmit={onNewExpense} />
            </div>
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center">
            <div>
              <p>No expenses recorded for this month</p>
            </div>
            <div className="mt-8">
              <Form onFormSubmit={onNewExpense} />
            </div>
          </div>
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
