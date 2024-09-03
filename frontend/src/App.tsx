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
import { getUserName, getExpense, fetchPlaidTransactions } from "./api/api";
import { useQuery } from "@tanstack/react-query";


function App() {
  const [authState, setAuthState] = useState<{isLoggedIn: boolean, isLoading: boolean}>({
    isLoggedIn: false,
    isLoading: true
  });
  const [data, setData] = useState<ExpenseInterface[]>([]);
  const [isPlaidConnected, setIsPlaidConnected] = useState<boolean>(false);

  const plaidAccessToken = localStorage.getItem("plaidAccessToken");
  
  const checkPlaidConnection = useCallback(() => {
    return plaidAccessToken !== null;
  }, [plaidAccessToken]);

  const {data : expenseData , isLoading : expenseLoading} = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpense,
    refetchOnWindowFocus: false,
  });
  
  const {data : plaidData, isLoading : plaidLoading} = useQuery({
    queryKey: ['plaidData'],
    queryFn: fetchPlaidTransactions,
    enabled: checkPlaidConnection(),
    refetchOnWindowFocus: false,
  });
 
  useEffect(() => {
    setIsPlaidConnected(checkPlaidConnection());
  }, [plaidAccessToken,checkPlaidConnection]);

  useEffect(() => {
    console.log("expenseData", expenseData);
    console.log("plaidData", plaidData);
    if (expenseData) {
      setData(expenseData);
    }
    if (plaidData && isPlaidConnected) {
      setData(prevData => {
        const combinedData = [...prevData, ...plaidData];
        return combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));
      });
    }
  },[expenseData, plaidData, isPlaidConnected])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const username = await getUserName();
        setAuthState({
          isLoggedIn: Boolean(username && username.length > 0),
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
          <Sidebar isLoggedIn={authState.isLoggedIn} setIsLoggedIn={authState.setIsLoggedIn} />
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
                    <Breakdown data={data} isDataLoading={expenseLoading || plaidLoading} authState={authState}/>
                  </PrivateRoute>
                }
              />
              <Route
                path="/expenses"
                element={
                  <PrivateRoute authState={authState}>
                    <List data={data} isLoading={expenseLoading || plaidLoading} setData={setData}/>
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
