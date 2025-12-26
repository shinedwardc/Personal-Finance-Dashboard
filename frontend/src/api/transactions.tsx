import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { TransactionInterface } from "@/interfaces/Transactions";

axios.defaults.withCredentials = true;

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

const authApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

type RetryAxiosRequestConfig = AxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (err: AxiosError) => {
    const error = err as AxiosError & { config: RetryAxiosRequestConfig };
    const original = error.config;

    const status = error.response?.status;
    const url = original?.url ?? "";

    // If no config, or not 401 → just reject
    if (!original || status !== 401) {
      return Promise.reject(error);
    }

    // Don't refresh when already calling auth endpoints
    const isAuthEndpoint =
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout") ||
      url.includes("/auth/login");

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Retry once per request
    if (original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = authApi
          .post("/auth/refresh/", {})
          .then(() => {})
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;
      return api(original);

    } catch (refreshError) {
      // If refresh fails, logout the user
      try {
        await authApi.post("/auth/logout/", {});
      } catch {
        // ignore
      }
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  },
);

export const getTransactions = async (): Promise<TransactionInterface[]> => {
  try {
    const response = await api.get("/transactions/");
    return response.data.expenses;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTransactionsByMonth = async (
  month: number,
  year: number,
): Promise<TransactionInterface[]> => {
  try {
    const response = await api.get("/transactions/", {
      params: { month, year },
    });
    console.log(response.data.expenses);
    return response.data.expenses;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addTransactions = async (
  newTransaction: TransactionInterface | TransactionInterface[],
): Promise<TransactionInterface | TransactionInterface[]> => {
  try {
    const response = await api.post(
      "/transactions/",
      newTransaction,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data as TransactionInterface | TransactionInterface[];
  } catch (error: any) {
    if (error.response) {
      console.log("Error response:", error.response.data);
    } else {
      console.log("Error message:", error.message);
    }
    throw error;
  }
};

export const deleteTransactions = async (ids: number[]) => {
  try {
    const response = await axios.delete("/transactions/", {
      data: { ids },
    });
    return response;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

export const editTransaction = async (
  expenseId: number,
  data: TransactionInterface,
) => {
  try {
    const response = await axios.patch(
      `/transactions/${expenseId}/`,
      data,
    );
    return response;
  } catch (error) {
    console.error("Error editing expense:", error);
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

