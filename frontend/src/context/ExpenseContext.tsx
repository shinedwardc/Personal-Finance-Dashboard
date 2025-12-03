import { useEffect, useState, createContext, ReactNode } from "react";
import { useProfileContext } from "@/hooks/useProfileContext";
import { ExpenseInterface } from "../interfaces/expenses";
import { Settings } from "../interfaces/settings";
import {
  getExpense,
  addExpense,
  deleteExpense,
  editExpense,
  updateBudgetLimit,
} from "../utils/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const ExpenseContext = createContext<
  | {
      data: ExpenseInterface[];
      setData: React.Dispatch<React.SetStateAction<ExpenseInterface[]>>;
      isDataLoading: boolean;
      addExpenseMutate: (
        newExpense: ExpenseInterface | ExpenseInterface[],
      ) => void;
      deleteExpenseMutate: (expenseId: number) => void;
      editExpenseMutate: ({
        expenseId,
        data,
      }: {
        expenseId: number;
        data: any;
      }) => void;
      settingsData: Settings;
      handleSettingsForm: (data: Settings) => void;
      settingsLoading: boolean;
    }
  | undefined
>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { authState, isProfileLoading } = useProfileContext();

  const [data, setData] = useState<ExpenseInterface[]>([]);

  const { data: expenseData, isLoading: expenseLoading } = useQuery({
    queryKey: ["expenses", authState.isLoggedIn],
    queryFn: getExpense,
    enabled: authState.isLoggedIn,
  });

  const { mutate: addExpenseMutate, isLoading: addExpenseLoading } =
    useMutation({
      mutationFn: (newExpense: ExpenseInterface | ExpenseInterface[]) =>
        addExpense(newExpense),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["monthlyExpenses"] });
      },
      onError: (error) => {
        console.error("Error adding expense:", error);
      },
    });

  const { mutate: deleteExpenseMutate, isLoading: deleteExpenseLoading } =
    useMutation({
      mutationFn: (expenseId: number[]) => deleteExpense(expenseId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["monthlyExpenses"] });
      },
      onError: (error) => {
        console.error("Error deleting expense:", error);
      },
    });

  const { mutate: editExpenseMutate, isLoading: editExpenseLoading } =
    useMutation({
      mutationFn: ({
        expenseId,
        data,
      }: {
        expenseId: number;
        data: ExpenseInterface;
      }) => editExpense(expenseId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["monthlyExpenses"] });
      },
      onError: (error) => {
        console.error("Error editing expense:", error);
      },
    });

  const { mutate: settingsMutate, isLoading: settingsMutateLoading } =
    useMutation({
      mutationFn: (data: Settings) => {
        return updateBudgetLimit(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["settings", authState.isLoggedIn],
        });
      },
    });

  const handleSettingsForm = (data: Settings): void => {
    //updateBudgetLimit(data);
    settingsMutate(data);
  };

  useEffect(() => {
    if (expenseData) {
      setData(expenseData);
    }
  }, [expenseData]);

  const isDataLoading =
    authState.isLoading ||
    expenseLoading ||
    //filteredDataLoading ||
    isProfileLoading;
  //settingsLoading;

  return (
    <ExpenseContext.Provider
      value={{
        data,
        setData,
        addExpenseMutate,
        deleteExpenseMutate,
        editExpenseMutate,
        handleSettingsForm,
        isDataLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
