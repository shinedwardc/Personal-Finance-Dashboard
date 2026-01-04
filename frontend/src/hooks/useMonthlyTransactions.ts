//import { useState } from 'react';
//import { useExpenseContext } from './useExpenseContext';
import { useSettingsContext } from "./useSettingsContext";
import { getTransactionsByMonth } from "../api/transactions";
import { useQuery } from "@tanstack/react-query";

export const useMonthlyTransactions = (monthAndYear: Date | null) => {
  const { authState } = useSettingsContext();

  const { data, isLoading } = useQuery({
    queryKey: [
      "monthlyTransactions",
      monthAndYear?.getMonth(),
      monthAndYear?.getFullYear(),
    ],
    queryFn: () =>
      monthAndYear
        ? getTransactionsByMonth(
            monthAndYear.getMonth() + 1,
            monthAndYear.getFullYear(),
          )
        : Promise.resolve([]),
    enabled: !!authState.isLoggedIn && !!monthAndYear,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
  return { data, isLoading  };
};
