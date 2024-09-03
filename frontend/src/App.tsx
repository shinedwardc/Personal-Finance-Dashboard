import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./components/sidebar";
import Breakdown from "./components/breakdown";
import List from "./components/list";
import Connections from "./components/Connections";
import PrivateRoute from "./components/privateRoute";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Signup from './components/signup';
import { ExpenseInterface } from "./interfaces/interface";
import { getUserName, getExpense, fetchPlaidTransactions, fetchPlaidBalance } from "./api/api";
import { useQuery } from "@tanstack/react-query";


function App() {
  const [authState, setAuthState] = useState<{isLoggedIn: boolean, isLoading: boolean}>({
    isLoggedIn: false,
    isLoading: true
  });
  const [data, setData] = useState<ExpenseInterface[]>([]);
  const [plaidBalance, setPlaidBalance] = useState<any>(null);

  const {data : expenseData , isLoading : expenseLoading} = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpense,
    refetchOnWindowFocus: false,
  });
  
  const {data : plaidData, isLoading : plaidLoading} = useQuery({
    queryKey: ['plaidData'],
    queryFn: fetchPlaidTransactions,
    refetchOnWindowFocus: false,
  });

  const {data : plaidBalanceData, isLoading : plaidBalanceLoading} = useQuery({
    queryKey: ['plaidBalance'],
    queryFn: fetchPlaidBalance,
    refetchOnWindowFocus: false,
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
        return combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));
      });
    }
  },[expenseData, plaidData])

  useEffect(() => {
    if (plaidBalanceData) {
      setPlaidBalance(plaidBalanceData);
    }
  }, [plaidBalanceData]);

  const isDataLoading = expenseLoading || plaidLoading || plaidBalanceLoading;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const username = await getUserName();
        setAuthState({
          isLoggedIn: Boolean(username),
          isLoading: false
        });
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthState({ isLoggedIn: false, isLoading: false });
      }
    };

    checkAuth();
  }, []);


  return (
      <Router>
        <ToastContainer />
        <div className="flex flex-col">
          <Sidebar authState={authState} setAuthState={setAuthState} />
          <div className="flex-grow flex flex-col items-center justify-center mt-20">
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={<Login setAuthState={setAuthState} />}
              />
              <Route path="/logout" element={<Logout setAuthState={setAuthState}/>} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute authState={authState}>
                    <Breakdown data={data} isDataLoading={isDataLoading} plaidBalance={plaidBalance}/>
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
