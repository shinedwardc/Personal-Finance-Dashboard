import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./components/sidebar";
import Breakdown from "./components/breakdown";
import List from "./components/list";
import Calendar from "./components/Calendar";
import Recurring from "./components/Recurring";
import Connections from "./components/Connections";
import PrivateRoute from "./components/privateRoute";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Signup from './components/signup';
import { ExpenseInterface, PlaidResponse, AuthState } from "./interfaces/interface";
import { getAuthStatus, getExpense, fetchPlaidTransactions, fetchPlaidBalance } from "./api/api";
import { useQuery } from "@tanstack/react-query";


function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    isPlaidConnected: false,
    isLoading: true
  });
  const [data, setData] = useState<ExpenseInterface[]>([]);
  const [plaidBalance, setPlaidBalance] = useState<PlaidResponse | null>(null);

  const {data : expenseData , isLoading : expenseLoading} = useQuery({
    queryKey: ['expenses', authState.isLoggedIn],
    queryFn: getExpense,
    enabled: authState.isLoggedIn
  });
  
  const {data : plaidData, isLoading : plaidLoading} = useQuery({
    queryKey: ['plaidData', authState.isLoggedIn, authState.isPlaidConnected],
    queryFn: fetchPlaidTransactions,
    enabled: authState.isLoggedIn && authState.isPlaidConnected
  });

  const {data : plaidBalanceData, isLoading : plaidBalanceLoading} = useQuery({
    queryKey: ['plaidBalance', authState.isLoggedIn, authState.isPlaidConnected],
    queryFn: fetchPlaidBalance,
    enabled: authState.isLoggedIn && authState.isPlaidConnected
  });

  useEffect(() => {
    console.log("expenseData", expenseData);
    console.log("plaidData", plaidData);
    if (expenseData) {
      setData(expenseData);
    }
    if (plaidData) {
      setData(prevData => {
        const combinedData = [...prevData, ...plaidData];
        return combinedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });
    }
  },[expenseData, plaidData])

  useEffect(() => {
    if (plaidBalanceData) {
      setPlaidBalance(plaidBalanceData);
    }
  }, [plaidBalanceData]);

  const isDataLoading = authState.isLoading || expenseLoading || plaidLoading || plaidBalanceLoading;

  useEffect(() => {
    const checkAuth = async () => {
      const response = await getAuthStatus();
      const plaidToken = localStorage.getItem("plaidAccessToken");
      setAuthState({
        isLoggedIn: response.authenticated,
        isPlaidConnected: Boolean(plaidToken),
        isLoading: false
      });
    };
    checkAuth();
  }, []);

  return (

      <Router>
        <ToastContainer />
        <div className="flex flex-col w-full">
          <Sidebar authState={authState} setAuthState={setAuthState} />
          <div className="flex-grow flex flex-col items-center justify-center mt-20">
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={<Login authState={authState} setAuthState={setAuthState} />}
              />
              <Route path="/logout" element={<Logout authState={authState} setAuthState={setAuthState}/>} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute authState={authState}>
                    <Breakdown data={data} setData={setData} isDataLoading={isDataLoading} plaidBalance={plaidBalance as PlaidResponse}/>
                  </PrivateRoute>
                }
              />
              <Route
                path="/expenses"
                element={
                  <PrivateRoute authState={authState}>
                    <List data={data} isLoading={isDataLoading} setData={setData}/>
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute authState={authState}>
                    <Calendar data={data} isLoading={isDataLoading} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/recurring"
                element={
                  <PrivateRoute authState={authState}>
                    <Recurring />
                  </PrivateRoute>
                }
              />
              <Route
                path="/connections"
                element={
                  <PrivateRoute authState={authState}>
                    <Connections />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
