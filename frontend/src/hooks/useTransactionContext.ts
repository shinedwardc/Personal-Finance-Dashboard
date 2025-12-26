import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useExpenseContext must be used within a DataProvider");
  }
  return context;
};
