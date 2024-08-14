import axios from 'axios';
import { Expense } from '../interfaces/interface';


export const getExpense = async (): Promise<Expense[]> => {
    try {
        const response = await axios.get('http://localhost:8000/expenses');
        return response.data.expenses;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};