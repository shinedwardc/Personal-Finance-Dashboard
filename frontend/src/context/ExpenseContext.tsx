import { useEffect, useState, createContext, ReactNode } from "react";
import { useProfileContext } from "@/hooks/useProfileContext";
import { ExpenseInterface } from "../interfaces/expenses";
import { AuthState } from "../interfaces/userAuth";
import { PlaidResponse } from "../interfaces/plaid";
import { Settings } from "../interfaces/settings";
import {
  getExpense,
  fetchPlaidTransactions,
  fetchPlaidBalance,
  updateBudgetLimit,
} from "../utils/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const ExpenseContext = createContext<
  | {
      data: ExpenseInterface[];
      setData: React.Dispatch<React.SetStateAction<ExpenseInterface[]>>;
      authState: AuthState;
      setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
      filteredData: ExpenseInterface[];
      isDataLoading: boolean;
      settingsData: Settings;
      handleSettingsForm: (data: Settings) => void;
      settingsLoading: boolean;
    }
  | undefined
>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const {
    authState,
    isProfileLoading,
  } = useProfileContext();
  const [data, setData] = useState<ExpenseInterface[]>([]);
  const [plaidBalance, setPlaidBalance] = useState<PlaidResponse | null>(null);

  const { data: expenseData, isLoading: expenseLoading } = useQuery({
    queryKey: ["expenses", authState.isLoggedIn],
    queryFn: getExpense,
    enabled: authState.isLoggedIn,
  });

  /*const { data: filteredByMonth, isLoading: filteredDataLoading } = useQuery({
    queryKey: ["expenses", authState.isLoggedIn, "filtered", monthAndYear],
    queryFn: () => getExpensesByMonth(monthAndYear.getMonth(), monthAndYear.getFullYear()),
    enabled: authState.isLoggedIn && !!monthAndYear,
  });*/

  const { data: plaidData, isLoading: plaidLoading } = useQuery({
    queryKey: ["plaidData", authState.isLoggedIn, authState.isPlaidConnected],
    queryFn: fetchPlaidTransactions,
    enabled: authState.isLoggedIn && authState.isPlaidConnected,
  });

  const { data: plaidBalanceData, isLoading: plaidBalanceLoading } = useQuery({
    queryKey: [
      "plaidBalance",
      authState.isLoggedIn,
      authState.isPlaidConnected,
    ],
    queryFn: fetchPlaidBalance,
    enabled: authState.isLoggedIn && authState.isPlaidConnected,
  });

  const mutation = useMutation({
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
    mutation.mutate(data);
  };

  useEffect(() => {
    //console.log("expenseData", expenseData);
    //console.log("plaidData", plaidData);
    if (expenseData) {
      setData(expenseData);
    }
    if (plaidData) {
      setData((prevData) => {
        const combinedData = [...prevData, ...plaidData];
        return combinedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      });
    }
  }, [expenseData, plaidData]);

  useEffect(() => {
    if (plaidBalanceData) {
      setPlaidBalance(plaidBalanceData);
    }
  }, [plaidBalanceData]);

  const isDataLoading =
    authState.isLoading ||
    expenseLoading ||
    //filteredDataLoading ||
    plaidLoading ||
    plaidBalanceLoading ||
    isProfileLoading;
  //settingsLoading;

  return (
    <ExpenseContext.Provider
      value={{
        data,
        setData,
        handleSettingsForm,
        plaidBalance,
        isDataLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
