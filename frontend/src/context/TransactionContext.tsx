import { useState, createContext, ReactNode } from "react";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { TransactionInterface } from "../interfaces/Transactions";
import { BudgetSettings } from "../interfaces/settings";
import {
  getTransactions,
  addTransactions,
  deleteTransactions,
  editTransaction,
} from "../api/transactions";
import { DateTime } from "luxon";
import { updateBudgetSettings, updateDisplaySettings } from "../api/user";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const TransactionContext = createContext<
  | {
      data: TransactionInterface[];
      setData: React.Dispatch<React.SetStateAction<TransactionInterface[]>>;
      isDataLoading: boolean;
      addTransactionMutate: (
        newTransaction: TransactionInterface | TransactionInterface[],
      ) => void;
      deleteTransactionMutate: (transactionId: number) => void;
      editTransactionMutate: ({
        transactionId,
        data,
      }: {
        transactionId: number;
        data: any;
      }) => void;
      settingsData: BudgetSettings;
      handleSettingsForm: (data: Settings) => void;
      settingsLoading: boolean;
    }
  | undefined
>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { authState, isProfileLoading } = useSettingsContext();

  const [data, setData] = useState<TransactionInterface[]>([]);

  const { data: transactionData, isLoading: transactionLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    enabled: authState.isLoggedIn,
  });

  const { mutate: addTransactionMutate, isLoading: addTransactionLoading } =
    useMutation({
      mutationFn: (newTransaction: TransactionInterface | TransactionInterface[]) =>
        addTransactions(newTransaction),
      onSuccess: (data,variables) => {
        const dateTime = DateTime.fromISO(variables.date);
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["monthlyTransactions", dateTime.year, dateTime.month - 1]});
      },
      onError: (error) => {
        console.error("Error adding transaction:", error);
      },
    });

  const { mutate: deleteTransactionMutate, isLoading: deleteTransactionLoading } =
    useMutation({
      mutationFn: (transactionId: number[]) => deleteTransactions(transactionId),
      onSuccess: (data, variables) => {
        const dateTime = DateTime.fromISO(variables.date);
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["monthlyTransactions", dateTime.year, dateTime.month - 1] });
      },
      onError: (error) => {
        console.error("Error deleting transactions:", error);
      },
    });

  const { mutate: editTransactionMutate, isLoading: editTransactionLoading } =
    useMutation({
      mutationFn: ({
        transactionId,
        data,
      }: {
        transactionId: number;
        data: TransactionInterface;
      }) => editTransaction(transactionId, data),
      onSuccess: (data, variables) => {
        const dateTime = DateTime.fromISO(variables.date);
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["monthlyTransactions", dateTime.year, dateTime.month - 1] });
      },
      onError: (error) => {
        console.error("Error editing transaction:", error);
      },
    });

  const isDataLoading =
    authState.isLoading ||
    transactionLoading ||
    isProfileLoading;

  return (
    <TransactionContext.Provider
      value={{
        data,
        setData,
        addTransactionMutate,
        deleteTransactionMutate,
        editTransactionMutate,
        isDataLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
