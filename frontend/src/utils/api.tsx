import axios, { AxiosInstance } from "axios";
import { Settings } from "../interfaces/settings";
import { ExpenseInterface } from "@/interfaces/expenses";

axios.defaults.withCredentials = true;

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

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
          "http://localhost:8000/api/auth/refresh/",
          {},
          { withCredentials: true },
        );
        //localStorage.setItem("accessToken", access);
        //error.config.headers["Authorization"] = `Bearer ${access}`;
        return api(error.config);
      } catch (refreshError) {
        // If refresh fails, logout the user
        //localStorage.removeItem("accessToken");
        //localStorage.removeItem("refreshToken");
        await api.post(
          "http://localhost:8000/api/auth/logout/",
          {},
          { withCredentials: true },
        );
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
    console.log("get expenses by month called", month, year);
    const response = await api.get("/expenses/", {
      params: { month, year },
    });
    console.log(response.data.expenses);
    return response.data.expenses;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addExpense = async (newExpense: {
  name: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  updated_at: string;
}): Promise<ExpenseInterface> => {
  try {
    const response = await api.post(
      "http://localhost:8000/expenses/",
      newExpense,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Expense created:", response.data);
    return response.data as ExpenseInterface;
  } catch (error: any) {
    if (error.response) {
      console.log("Error response:", error.response.data);
    } else {
      console.log("Error message:", error.message);
    }
    throw error;
  }
};

export const deleteExpense = async (ids: number[]) => {
  try {
    console.log(ids);
    const response = await axios.delete(`http://localhost:8000/expenses/`, {
      data: { ids },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

export const editExpense = async (
  expenseId: number,
  data: ExpenseInterface,
) => {
  try {
    const response = await axios.patch(
      `http://localhost:8000/expenses/${expenseId}/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Error editing expense:", error);
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
    console.log(response.data.transactions);
    return response.data.transactions.map((transaction: any) => ({
      id: transaction.id,
      name: transaction.name,
      category: transaction.category,
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
    console.log("fetching profile settings");
    const response = await api.get("/get-profile-settings/");
    console.log(response.data);
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
