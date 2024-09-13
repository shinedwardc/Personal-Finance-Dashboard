import axios, {AxiosInstance} from "axios";
import { ExpenseInterface } from "../interfaces/interface";

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    // Only attach Authorization header if token is available
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('config:')
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
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

export const getAuthStatus = async () => { 
  try {
    const response = await api.get("/auth-status/");
    console.log('response: ', response);
    
    // Handle the case where authenticated is explicitly set to false
    if (response.status === 200) {
      console.log('auth status response: ', response.data);
      return response.data;  // Return the response data that includes 'authenticated'
    }
    
    // Handle other cases where the status is not 200 (optional)
    console.log('Unexpected status code:', response.status);
    return { authenticated: false };  // Fallback in case of unexpected behavior

  } catch (error) {
    console.error('Error fetching auth status', error);

    // Fallback: If any other error occurs, assume unauthenticated
    return { authenticated: false };  // Ensure the fallback doesn't break the app
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