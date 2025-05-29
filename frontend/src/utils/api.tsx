import axios, { AxiosInstance } from "axios";
import { Settings } from "../interfaces/settings";
import { ExpenseInterface } from "@/interfaces/expenses";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // Only attach Authorization header if token is available
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    //console.log('config:')
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config._retry
    ) {
      error.config._retry = true;
      try {
        const response = await axios.post(
          "http://localhost:8000/api/token/refresh/",
          {
            refresh: localStorage.getItem("refreshToken"),
          },
        );
        const { access } = response.data;
        console.log(
          "refreshed, here is the response data of refresh: ",
          response.data,
        );
        localStorage.setItem("accessToken", access);
        error.config.headers["Authorization"] = `Bearer ${access}`;
        return api(error.config);
      } catch (refreshError) {
        // If refresh fails, logout the user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Redirect to login page or dispatch a logout action
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export const getExpense = async (): Promise<ExpenseInterface[]> => {
  try {
    console.log("get expenses called");
    const response = await api.get("/expenses/");
    return response.data.expenses;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getExpensesByMonth = async (
  month: number,
  year: number,
): Promise<ExpenseInterface[]> => {
  try {
    console.log("get expenses by month called");
    const response = await api.get("/expenses/", {
      params: { month, year },
    });
    return response.data.expenses;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get("/categories/");
    console.log("categories: ", response.data.categories);
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
    console.log("response: ", response);

    // Handle the case where authenticated is explicitly set to false
    if (response.status === 200) {
      console.log("auth status response: ", response.data);
      return response.data; // Return the response data that includes 'authenticated'
    }

    // Handle other cases where the status is not 200 (optional)
    console.log("Unexpected status code:", response.status);
    return { authenticated: false }; // Fallback in case of unexpected behavior
  } catch (error) {
    console.error("Error fetching auth status", error);

    // Fallback: If any other error occurs, assume unauthenticated
    return { authenticated: false }; // Ensure the fallback doesn't break the app
  }
};

export const fetchPlaidTransactions = async () => {
  try {
    const accessToken = localStorage.getItem("plaidAccessToken");
    console.log(accessToken);
    const response = await api.get("/get-transactions/", {
      params: { access_token: accessToken },
    });
    return response.data.transactions.map((transaction: any) => ({
      id: transaction.id,
      name: transaction.name,
      category: transaction.category[0],
      amount: transaction.amount,
      currency: transaction.currency,
      description: transaction.description,
      date: transaction.date,
    }));
  } catch (error) {
    console.error("Error fetching Plaid transactions:", error);
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
};

export const fetchInvestments = async () => {
  try {
    const response = await api.get("/get-investments/");
    console.log(response.data);
    const data = response.data.map((investment: any) => {
      return {
        id: investment.id,
        symbol: investment.symbol,
        quantity: investment.quantity,
        purchasePrice: investment.purchase_price,
        currentPrice: investment.current_price,
        purchaseDate: investment.purchase_date,
      };
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchProfileSettings = async () => {
  try {
    const response = await api.get("/get-profile-settings/");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateBudgetLimit = async (data: Settings) => {
  try {
    console.log(data);
    const response = await api.post("/update_monthly_budget/", {
      monthlyBudget: data.monthlyBudget,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating budget limit:", error);
  }
};
