import axios, {AxiosInstance} from "axios";
import { ExpenseInterface } from "../interfaces/interface";

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  },
  withCredentials: true
});

api.interceptors.request.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getExpense = async (): Promise<ExpenseInterface[]> => {
  try {
    const response = await api.get("/expenses/");
    console.log(response.data.expenses);
    return response.data.expenses;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get("/categories/");
    console.log('categories: ', response.data.categories)
    return response.data.categories;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserName = async () => {
  try {
    const response = await api.get("/get-user/");
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
    const response = await api.get("/get-transactions/", {
      params: { access_token: accessToken },
    });
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
    const response = await api.get("/get-balance/", {
      params: { access_token: accessToken },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}