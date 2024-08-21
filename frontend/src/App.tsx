import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import Breakdown from './components/breakdown';
import List from './components/list';
import PrivateRoute from './components/privateRoute';
import Login from './components/Login';
import Logout from './components/Logout';

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')){
      setIsLoggedIn(true);
    }
  },[]);

  return (
    <Router>
      <div className="flex">
        <Sidebar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <div className="flex-grow flex flex-col items-center justify-center mt-10">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
            <Route path="/logout" element={<Logout />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Breakdown />
                </PrivateRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <PrivateRoute>
                  <List />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
