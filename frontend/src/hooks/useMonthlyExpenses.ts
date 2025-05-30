//import { useState } from 'react';
//import { useExpenseContext } from './useExpenseContext';
import { useProfileContext } from './useProfileContext';
import { useCalendarContext } from './useCalendarContext';
import { getExpensesByMonth } from '../utils/api';
import { useQuery } from '@tanstack/react-query';

export const useMonthlyExpenses = (monthAndYear: Date | null) => {
    //const { monthAndYear } = useCalendarContext();
    //const [monthAndYear, setMonthAndYear] = useState<Date>(new Date());
    const { authState } = useProfileContext();

    const { data, isLoading } = useQuery({
        queryKey: ['monthlyExpenses', authState.isLoggedIn, monthAndYear?.getMonth(), monthAndYear?.getFullYear()],
        queryFn: () => 
            monthAndYear 
            ? getExpensesByMonth(monthAndYear.getMonth() + 1, monthAndYear.getFullYear())
            : Promise.resolve([]),
        enabled: !!authState.isLoggedIn && !!monthAndYear,
    });
    return { data, isLoading };
}