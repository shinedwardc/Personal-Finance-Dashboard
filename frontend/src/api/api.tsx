import axios from "axios";
import { ExpenseInterface, Category } from "../interfaces/interface";

export const getExpense = async (): Promise<ExpenseInterface[]> => {
  try {
    const response = await axios.get("http://localhost:8000/expenses", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    console.log(response.data.expenses);
    return response.data.expenses;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get("http://localhost:8000/categories/");
    const categories: string[] = [];
    response.data.categories.forEach((category: Category) =>
      categories.push(category.name),
    );
    console.log(categories);
    return categories;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserName = async () => {
  try {
    const response = await axios.get("http://localhost:8000/get-user/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const username = response.data.username;
    return username;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchPlaidTransactions = async () => {
  try {
    const accessToken = localStorage.getItem("plaidAccessToken");
    console.log(accessToken);
    const response = await axios.get('http://localhost:8000/get-transactions/', {
      params: { access_token: accessToken },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log(response.data);
    return response.data.transactions.map((transaction:any) => (
      {
        category: transaction.category,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
      }
    ))
  }
  catch (error) {
    console.error('Error fetching Plaid transactions:', error);
    return [];
  }
 };