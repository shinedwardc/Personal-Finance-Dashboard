import { useEffect, useState, createContext, ReactNode } from "react";
import { useProfileContext } from "@/hooks/useProfileContext";
import { TransactionInterface } from "../interfaces/Transactions";
import { Settings } from "../interfaces/settings";
import {
  getTransactions,
  addTransactions,
  deleteTransactions,
  editTransaction,
} from "../api/transactions";
import { updateBudgetLimit } from "../api/user";
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
      settingsData: Settings;
      handleSettingsForm: (data: Settings) => void;
      settingsLoading: boolean;
    }
  | undefined
>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { authState, isProfileLoading } = useProfileContext();

  const [data, setData] = useState<TransactionInterface[]>([]);

  const { data: transactionData, isLoading: transactionLoading } = useQuery({
    queryKey: ["transactions", authState.isLoggedIn],
    queryFn: getTransactions,
    enabled: authState.isLoggedIn,
  });

  const { mutate: addTransactionMutate, isLoading: addTransactionLoading } =
    useMutation({
      mutationFn: (newTransaction: TransactionInterface | TransactionInterface[]) =>
        addTransactions(newTransaction),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
      onError: (error) => {
        console.error("Error adding transaction:", error);
      },
    });

  const { mutate: deleteTransactionMutate, isLoading: deleteTransactionLoading } =
    useMutation({
      mutationFn: (transactionId: number[]) => deleteTransactions(transactionId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
      onError: (error) => {
        console.error("Error editing transaction:", error);
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
    if (transactionData) {
      setData(transactionData);
    }
  }, [transactionData]);

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
        handleSettingsForm,
        isDataLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
