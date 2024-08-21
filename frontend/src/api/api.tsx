import axios from 'axios';
import { ExpenseInterface, Category } from '../interfaces/interface';


export const getExpense = async (): Promise<ExpenseInterface[]> => {
    try {
        const response = await axios.get('http://localhost:8000/expenses');
        return response.data.expenses;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCategories = async (): Promise<string[]> => {
    try {
        const response = await axios.get('http://localhost:8000/categories/');
        const categories : string[] = [];
        response.data.categories.forEach((category : Category) => categories.push(category.name));
        console.log(categories);
        return categories;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};