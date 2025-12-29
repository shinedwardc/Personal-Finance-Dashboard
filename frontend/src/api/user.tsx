import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { BudgetSettings, DisplaySettings } from "../interfaces/settings";

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


export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post("/auth/", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const googleLogin = async (token: string) => {
  try {
    const response = await api.post("/auth/google/", {
      token,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getUserName = async () => {
  try {
    const response = await api.get("/user/");
    const username = response.data.username;
    return username;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAuthStatus = async () => {
  try {
    const response = await api.get("/auth/status/");

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

export const fetchUserSettings = async () => {
  try {
    const response = await api.get("/user/settings/");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateBudgetSettings = async (data: BudgetSettings) => {
  try {
    console.log(data);
    const response = await api.post("/user/settings/budget/", data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating budget limit:", error);
  }
};

export const updateDisplaySettings = async (data: DisplaySettings) => {
  try {
    console.log(data);
    const response = await api.post("/user/settings/display/", data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating display settings:", error);
  }
};