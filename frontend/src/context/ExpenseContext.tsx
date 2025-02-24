import { createContext, ReactNode } from "react";
import { ExpenseInterface } from "../interfaces/expenses";

export const ExpenseContext = createContext<{
    data : ExpenseInterface[], 
    setData : React.Dispatch<React.SetStateAction<ExpenseInterface[]>>,
    isDataLoading : boolean
} | undefined>(undefined);

export const ExpenseProvider = ({ 
  children, 
  data, 
  setData, 
  isDataLoading 
} : { 
  children: ReactNode, 
  data : ExpenseInterface[],
  setData: React.Dispatch<React.SetStateAction<ExpenseInterface[]>>,
  isDataLoading: boolean
}) => {
  return (
    <ExpenseContext.Provider value={{data, setData, isDataLoading}}>
      {children}
    </ExpenseContext.Provider>  
  ) 
}