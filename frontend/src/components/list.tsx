import { useState, useMemo } from "react";
import { useExpenseContext } from "@/hooks/useExpenseContext";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import Form from "@/components/Form";
import { DataTable } from "./ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogPortal, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import MonthPicker from "./ui/month-picker";
import { toast, Bounce } from "react-toastify";
import { TbSortAscendingLetters } from "react-icons/tb";
import { TbSortDescendingLetters } from "react-icons/tb";
import { ExpenseInterface } from "@/interfaces/expenses";

//https://flowbite.com/docs/components/spinner/#progress-spinner

const List = () => {
  const [monthAndYear, setMonthAndYear] = useState<Date>(new Date());
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<
    "ascending" | "descending"
  >("ascending");
  const [search, setSearch] = useState<string>("");
  const { deleteExpenseMutate } = useExpenseContext();

  
  const [editData, setEditData] = useState<ExpenseInterface | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: monthlyExpenses, isLoading: isMonthlyExpensesLoading } =
    useMonthlyExpenses(monthAndYear);

  //const [list, setList] = useState<ExpenseInterface[] | undefined>(undefined);

  const expenseList = useMemo(() => {
    if (!monthlyExpenses) return [];
    const query = search.toLowerCase();
    const filteredExpenses = monthlyExpenses.filter((expense) => {
      const name = expense.name.toLowerCase().includes(query);
      const category = expense.category.toLowerCase().includes(query);
      return name || category;
    });
    return [...filteredExpenses].sort((a, b) => {
      const getField = (expense: ExpenseInterface) => {
        if (sortBy === "date") return expense.date;
        if (sortBy === "category") return expense.category;
        if (sortBy === "name") return expense.name;
        return "";
      };
      if (sortDirection === "ascending") {
        return getField(a).localeCompare(getField(b));
      }
      return getField(b).localeCompare(getField(a));
    });
  }, [monthlyExpenses, sortBy, sortDirection, search]);

  const onNewExpense = async () => {
    setIsEditModalOpen(false);
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

  const onEditExpense = async () => {
    setIsEditModalOpen(false);
    setEditData(null); // Clear edit data
    try {
      toast.success("Successfully updated expense", {
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
      toast.error("Failed to update expense", {
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
      console.error("Failed to update expense:", error);
    }
  };

  const handleDeleteTransaction = async (expenseId: number) => {
    try {
      deleteExpenseMutate(expenseId);
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
    } finally {
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
    }
  };

  const handleEditTransaction = async (expense: ExpenseInterface) => {
    console.log(expense);
    setEditData(expense);
    setIsEditModalOpen(true);
  }

  const handleSortChange = (value: string) => {
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
  };

  const handleDirectionChange = (value: "ascending" | "descending") => {
    setSortDirection(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
  };

  return (
    <>
      {!isMonthlyExpensesLoading ? (
        <>
          <Dialog modal={false} open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogPortal>
              <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40" />
              <DialogContent
                className="z-50"
              >
                <DialogHeader>
                  <DialogTitle>{editData ? "Update" : "Add"} Expense</DialogTitle>
                </DialogHeader>
                {editData ? (
                  <Form
                    addingNewExpense={false}
                    initialValues={{
                      ...editData,
                      date: new Date(editData.date),
                    }}
                    onFormSubmit={onEditExpense}
                  />
                ) : (
                  <Form addingNewExpense={true} onFormSubmit={onNewExpense}/>
                )}
              </DialogContent>
            </DialogPortal>
          </Dialog>
          <div className="mt-16 flex flex-col md:flex-row w-full justify-between items-center gap-4">
            <div className="flex-1 flex flex-row md:justify-end justify-center">
              <h1 className="text-3xl font-semibold antialiased dark:text-white">
                Transactions
              </h1>
            </div>
            <div className="flex-1 flex md:justify-start justify-center">
              <div className="flex justify-center">
                <Button variant="default" onClick={() => setIsEditModalOpen(true)}>Add +</Button>
              </div>
            </div>
          </div>
          <div className="flex md:flex-row flex-col w-full mt-2 justify-between gap-4">
            <div className="flex-1 flex flex-row gap-2 md:justify-end justify-center items-center">
              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                Sort by
              </label>
              <Select onValueChange={handleSortChange} defaultValue="date">
                <SelectTrigger className="md:w-1/5 w-1/3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Select
                onValueChange={handleDirectionChange}
                defaultValue="ascending"
              >
                <SelectTrigger className="md:w-1/5 w-1/3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ascending">
                    <span className="flex flex-row items-center gap-1">
                      Ascending <TbSortAscendingLetters />
                    </span>
                  </SelectItem>
                  <SelectItem value="descending">
                    <span className="flex flex-row items-center gap-1">
                      Descending <TbSortDescendingLetters />
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex flex-row gap-2 md:justify-start justify-center items-center">
              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                Search
              </label>
              <Input
                className="md:w-1/4 w-[275px]"
                onChange={handleSearch}
                value={search}
                placeholder="Filter tasks..."
              />
            </div>
          </div>
          {expenseList.length > 0 ? (
            <div className="mt-4">
              <DataTable data={expenseList} onDelete={handleDeleteTransaction} onEdit={handleEditTransaction} />
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center">
              <div>
                <p>No expenses recorded for this month</p>
              </div>
            </div>
          )}
          <div>
            <MonthPicker
              currentMonth={new Date(monthAndYear)}
              onMonthChange={(newDate) => {
                setMonthAndYear(newDate);
              }}
            />
          </div>
          {/*<div className="mt-4 dark:text-slate-200">--- OR ---</div>
          <div className="my-4 p-4 border border-green-800 dark:text-white">
            <Recurring onFormSubmit={onNewExpense} />
          </div>*/}
        </>
      ) : (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white-900"></div>
        </div>
      )}
    </>
  );
};

export default List;
