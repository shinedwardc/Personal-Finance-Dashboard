import { useState, useEffect } from "react";
import { ExpenseProvider } from "./context/ExpenseContext";
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
  fetchPlaidTransactions,
  fetchPlaidBalance,
  fetchProfileSettings,
  updateBudgetLimit,
} from "./utils/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";


function App() {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    isPlaidConnected: false,
    isLoading: true,
  });
  const [data, setData] = useState<ExpenseInterface[]>([]);
  const [plaidBalance, setPlaidBalance] = useState<PlaidResponse | null>(null);

  const { data: expenseData, isLoading: expenseLoading } = useQuery({
    queryKey: ["expenses", authState.isLoggedIn],
    queryFn: getExpense,
    enabled: authState.isLoggedIn,
  });

  const { data: plaidData, isLoading: plaidLoading } = useQuery({
    queryKey: ["plaidData", authState.isLoggedIn, authState.isPlaidConnected],
    queryFn: fetchPlaidTransactions,
    enabled: authState.isLoggedIn && authState.isPlaidConnected,
  });

  const { data: plaidBalanceData, isLoading: plaidBalanceLoading } = useQuery({
    queryKey: [
      "plaidBalance",
      authState.isLoggedIn,
      authState.isPlaidConnected,
    ],
    queryFn: fetchPlaidBalance,
    enabled: authState.isLoggedIn && authState.isPlaidConnected,
  });

  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ["settings", authState.isLoggedIn],
    queryFn: fetchProfileSettings,
    enabled: authState.isLoggedIn,
  });

  const mutation = useMutation({
    mutationFn: (data: Settings) => {
      return updateBudgetLimit(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings", authState.isLoggedIn],
      });
    },
  });

  const handleSettingsForm = (data: Settings): void => {
    //updateBudgetLimit(data);
    mutation.mutate(data);
  };

  useEffect(() => {
    //console.log("expenseData", expenseData);
    //console.log("plaidData", plaidData);
    if (expenseData) {
      setData(expenseData);
    }
    if (plaidData) {
      setData((prevData) => {
        const combinedData = [...prevData, ...plaidData];
        return combinedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      });
    }
  }, [expenseData, plaidData]);

  useEffect(() => {
    if (plaidBalanceData) {
      setPlaidBalance(plaidBalanceData);
    }
  }, [plaidBalanceData]);

  const isDataLoading =
    authState.isLoading ||
    expenseLoading ||
    plaidLoading ||
    plaidBalanceLoading ||
    settingsLoading;

  useEffect(() => {
    const checkAuth = async () => {
      const response = await getAuthStatus();
      const plaidToken = localStorage.getItem("plaidAccessToken");
      setAuthState({
        isLoggedIn: response.authenticated,
        isPlaidConnected: Boolean(plaidToken),
        isLoading: false,
      });
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <ToastContainer />
      <ThemeProvider storageKey="vite-ui-theme">
        <div className="min-h-screen dark:bg-black dark:text-white overflow-auto font-inter">
          <div className="flex flex-row gap-5">
            <Navbar authState={authState} setAuthState={setAuthState} />
            {/*<ModeToggle />*/}
          </div>
          <ExpenseProvider data={data} setData={setData} isDataLoading={isDataLoading}>
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
                      <Breakdown
                        //data={data}
                        settings={settingsData}
                        //setData={setData}
                        //isDataLoading={isDataLoading}
                        plaidBalance={plaidBalance as PlaidResponse}
                      />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute authState={authState}>
                      <CalendarProvider>
                        <Dashboard 
                          plaidBalance={plaidBalance as PlaidResponse}
                          settings={settingsData}
                        />
                      </CalendarProvider>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <PrivateRoute authState={authState}>
                      <List
                        //data={data}
                        //isLoading={isDataLoading}
                        //setData={setData}
                      />
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
                      <CalendarProvider>
                        <Calendar/>
                      </CalendarProvider>
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
          </ExpenseProvider>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
