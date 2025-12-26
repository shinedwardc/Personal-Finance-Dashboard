import axios, { AxiosInstance } from "axios";
import { Settings } from "../interfaces/settings";

axios.defaults.withCredentials = true;

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

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
    console.log(token);
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