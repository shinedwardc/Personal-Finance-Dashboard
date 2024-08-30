import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
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
import { getUserName } from "./api/api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const username = await getUserName();
        //console.log(username);
        if (
          username && username.length > 0
        ) {
          setIsLoggedIn(true);
        }
        else{
          setIsLoggedIn(false);
        }
      }
      catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }
    if (localStorage.getItem('accessToken')){
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <></>
      
    )
  }

  return (
    <Router>
      <ToastContainer />
      <div className="flex flex-col">
        <Sidebar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className="flex-grow flex flex-col items-center justify-center mt-20">
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Breakdown />
                </PrivateRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <List />
                </PrivateRoute>
              }
            />
            <Route
              path="/connections"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
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
