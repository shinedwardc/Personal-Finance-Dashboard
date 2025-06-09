//import { useState } from 'react';
//import { useExpenseContext } from './useExpenseContext';
import { useProfileContext } from "./useProfileContext";
import { getExpensesByMonth } from "../utils/api";
import { useQuery } from "@tanstack/react-query";

export const useMonthlyExpenses = (monthAndYear: Date | null) => {
  const { authState } = useProfileContext();

  const { data, isLoading } = useQuery({
    queryKey: [
      "monthlyExpenses",
      authState.isLoggedIn,
      monthAndYear?.getMonth(),
      monthAndYear?.getFullYear(),
    ],
    queryFn: () =>
      monthAndYear
        ? getExpensesByMonth(
            monthAndYear.getMonth() + 1,
            monthAndYear.getFullYear(),
          )
        : Promise.resolve([]),
    enabled: !!authState.isLoggedIn && !!monthAndYear,
    refetchOnWindowFocus: false,
  });
  return { data, isLoading };
};
