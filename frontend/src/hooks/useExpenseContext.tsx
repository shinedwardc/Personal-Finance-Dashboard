import { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenseContext must be used within a DataProvider");
  }
  return context;
};
