import { useState, useEffect } from "react";
//import { ExpenseProvider } from "./context/ExpenseContext";
import { useExpenseContext } from "./hooks/useExpenseContext";
import { CalendarProvider } from "./context/CalendarContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { ModeToggle } from "./components/modeToggle";
import Navbar from "./components/Navbar";
import Introduction from "./components/Introduction";
import Breakdown from "./components/Breakdown";
import Dashboard from "./components/Dashboard";
import List from "./components/List";
import Calendar from "./components/ExpenseCalendar";
import Stats from "./components/Stats";
import Investments from "./components/Investments";
import Profile from "./components/Profile";
import PrivateRoute from "./components/privateRoute";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Signup from "./components/Signup";
import PasswordRecovery from "./components/PasswordRecovery";
import { ExpenseInterface } from "./interfaces/expenses";
import { AuthState } from "./interfaces/userAuth";
import { PlaidResponse } from "./interfaces/plaid";
import { Settings } from "./interfaces/settings";
import {
  getAuthStatus,
  getExpense,
  getExpensesByMonth,
  fetchPlaidTransactions,
  fetchPlaidBalance,
  fetchProfileSettings,
  updateBudgetLimit,
} from "./utils/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

function App() {
  const {
    data,
    authState,
    setAuthState,
    isDataLoading,
    settingsData,
    handleSettingsForm,
    plaidBalance,
    settingsLoading,
  } = useExpenseContext();

  return (
    <Router>
      <ToastContainer />
      <ThemeProvider storageKey="vite-ui-theme">
        <div className="min-h-screen dark:bg-black dark:text-white overflow-auto font-inter">
          <div className="flex flex-row gap-5">
            <Navbar authState={authState} setAuthState={setAuthState} />
            {/*<ModeToggle />*/}
          </div>
          {/*<ExpenseProvider data={data} setData={setData} isDataLoading={isDataLoading}>*/}
          <div className="flex-grow flex flex-col items-center justify-center mr-[64px]">
            <Routes>
              {/* Public routes */}
              <Route
                path="/about"
                element={<Introduction authState={authState} />}
              />
              <Route
                path="/login"
                element={
                  <Login authState={authState} setAuthState={setAuthState} />
                }
              />
              <Route
                path="/logout"
                element={
                  <Logout authState={authState} setAuthState={setAuthState} />
                }
              />
              <Route path="/signup" element={<Signup />} />
              <Route path="/recover" element={<PasswordRecovery />} />
              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute authState={authState}>
                    <Dashboard
                      settings={settingsData}
                      plaidBalance={plaidBalance as PlaidResponse}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute authState={authState}>
                    <Dashboard
                      plaidBalance={plaidBalance as PlaidResponse}
                      settings={settingsData}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <PrivateRoute authState={authState}>
                    <List />
                  </PrivateRoute>
                }
              />
              <Route
                path="/investments"
                element={
                  <PrivateRoute authState={authState}>
                    <Investments />
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute authState={authState}>
                    <Calendar />
                  </PrivateRoute>
                }
              />
              <Route
                path="/stats"
                element={
                  <PrivateRoute authState={authState}>
                    <Stats data={data} isLoading={isDataLoading} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute authState={authState}>
                    <Profile
                      settings={settingsData}
                      isLoading={settingsLoading}
                      onFormSubmit={handleSettingsForm}
                    />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          {/*</ExpenseProvider>*/}
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
