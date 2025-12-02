import { useState, useMemo } from "react";
import { useExpenseContext } from "@/hooks/useExpenseContext";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import Form from "@/components/Form";
import { DataTable } from "./ui/data-table";
import {
  Dialog,
  DialogPortal,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import MonthPicker from "./ui/month-picker";
import { toast, Bounce } from "react-toastify";
import { ExpenseInterface } from "@/interfaces/expenses";

//https://flowbite.com/docs/components/spinner/#progress-spinner

const List = () => {
  const today = useMemo(() => new Date(), []);
  const [monthAndYear, setMonthAndYear] = useState<Date>(today);
  const { deleteExpenseMutate } = useExpenseContext();

  const [editData, setEditData] = useState<ExpenseInterface | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: expenseList, isLoading: isMonthlyExpensesLoading } =
    useMonthlyExpenses(monthAndYear);

  //const [list, setList] = useState<ExpenseInterface[] | undefined>(undefined);

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

  const handleDeleteTransaction = async (expenseId: number[]) => {
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
  };

  return (
    <>
      {!isMonthlyExpensesLoading ? (
        <>
          <Dialog
            modal={false}
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
          >
            <DialogPortal>
              <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40" />
              <DialogContent className="z-50">
                <DialogHeader>
                  <DialogTitle>
                    {editData ? "Update" : "Add"} Expense
                  </DialogTitle>
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
                  <Form addingNewExpense={true} onFormSubmit={onNewExpense} />
                )}
              </DialogContent>
            </DialogPortal>
          </Dialog>
          <div className="mt-12 flex flex-col md:flex-row w-full justify-center items-center gap-4">
            <div className="flex justify-center gap-x-2">
              <h1 className="text-3xl font-semibold antialiased dark:text-white">
                Transactions
              </h1>
              <div className="flex-1 flex md:justify-start justify-center">
                <div className="flex justify-center">
                  <Button
                    variant="default"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Add +
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {expenseList && expenseList.length > 0 ? (
            <div className="mt-2">
              <DataTable
                data={expenseList}
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
              />
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
