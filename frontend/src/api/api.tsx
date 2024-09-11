import axios from "axios";
import { ExpenseInterface, Category } from "../interfaces/interface";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
});

export const getExpense = async (): Promise<ExpenseInterface[]> => {
  try {
    const response = await axios.get("http://localhost:8000/expenses", {
      headers: getAuthHeader()
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
    console.log('categories: ', response.data.categories)
    return response.data.categories;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserName = async () => {
  try {
    const response = await axios.get("http://localhost:8000/get-user/", {
      headers: getAuthHeader(),
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
      headers: getAuthHeader(),
    });
    //console.log('plaid transaction data: ', response.data);
    return response.data.transactions.map((transaction:any) => (
      {
        id: transaction.id,
        name: transaction.name,
        category: transaction.category[0],
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        date: transaction.date,
      }
    ))
  }
  catch (error) {
    console.error('Error fetching Plaid transactions:', error);
    return [];
  }
};

export const fetchPlaidBalance = async () => {
  try {
    const accessToken = localStorage.getItem("plaidAccessToken");
    const response = await axios.get("http://localhost:8000/get-balance/", {
      params: { access_token: accessToken },
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}