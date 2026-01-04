import { useState, useEffect, useMemo } from "react";
import { useTransactionContext } from "@/hooks/useTransactionContext";
import { useMonthlyTransactions } from "@/hooks/useMonthlyTransactions";
import Form from "@/components/Form";
import CSVImport from "./CSVImport";
import { DataTable } from "./ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import MonthPicker from "./ui/month-picker";
import { toast, Bounce } from "react-toastify";
import { TransactionInterface } from "@/interfaces/Transactions";


const List = () => {
  const today = useMemo(() => new Date(), []);
  const [monthAndYear, setMonthAndYear] = useState<Date>(today);
  const { addTransactionMutate, deleteTransactionMutate } = useTransactionContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editData, setEditData] = useState<TransactionInterface | null>(null);
  //const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: transactionList, isLoading: isMonthlyTransactionsLoading } =
    useMonthlyTransactions(monthAndYear);

  const [importedData, setImportedData] = useState<TransactionInterface[] | null>(
    null,
  );

  useEffect(() => {
    if (importedData) {
      addTransactionMutate(importedData);
    }
  }, [importedData, addTransactionMutate]);

  const onFormNewTransactions = async () => {
    setIsDialogOpen(false);
    try {
      toast.success("Succesfully added transactions", {
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
      toast.error("Failed to add transactions", {
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
      console.error("Failed to refetch transactions:", error);
    }
  };

  const onFormEditTransaction = async () => {
    setEditData(null); // Clear edit data
    setIsDialogOpen(false);
    try {
      toast.success("Successfully updated transaction", {
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
      toast.error("Failed to update transaction", {
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
      console.error("Failed to update transaction:", error);
    }
  };

  const handleDeleteTransactions = async (transactionId: number[]) => {
    try {
      console.log(transactionId);
      deleteTransactionMutate(transactionId);
    } catch (error) {
      toast.error("Failed to add transactions", {
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
      console.error("Failed to delete expense ", transactionId, error);
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

  const handleEditTransaction = async (transaction: TransactionInterface) => {
    setEditData(transaction);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="mt-12 flex flex-col md:flex-row w-full justify-center items-center mb-4">
        <div className="flex justify-center gap-x-2">
          <h1 className="text-3xl font-semibold antialiased dark:text-white">
            Transactions
          </h1>
          <div className="flex-1 flex md:justify-start justify-center">
            <div className="flex flex-row justify-center gap-x-2 fixed bottom-6 right-6">
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) setEditData(null);
                }}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="px-10 py-6 text-lg 
                                rounded-full shadow-lg bg-white/20 backdrop-blur-lg 
                                border border-white/30 hover:bg-white/30
                                "
                  >
                    Add +
                  </Button>
                </DialogTrigger>
                <DialogContent className="z-50"
                  onInteractOutside={(e) => e.preventDefault()}         
                >
                  <DialogHeader>
                    <DialogTitle>{editData ? "Edit" : "Add"} Transaction</DialogTitle>
                  </DialogHeader>
                  {editData ? (
                    <Form
                      addingNewTransaction={false}
                      initialValues={{
                        ...editData,
                        date: new Date(editData.date),
                      }}
                      onFormSubmit={onFormEditTransaction}
                    />
                  ) : (
                    <Form 
                      addingNewTransaction={true} 
                      onFormSubmit={onFormNewTransactions} 
                    />
                  )}
                </DialogContent>
              </Dialog>
              <CSVImport setImportedData={setImportedData} />
            </div>
          </div>
        </div>
      </div>
      {transactionList && transactionList.length > 0 ? (
        <div
          className="
                      bg-white/10 dark:bg-white/5 
                        backdrop-blur-xl 
                        rounded-xl border border-white/10 
                        p-4 shadow-lg          
                        "
        >
          <DataTable
            data={transactionList}
            onDelete={handleDeleteTransactions}
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
  );
};

export default List;
