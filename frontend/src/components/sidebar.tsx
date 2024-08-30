import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logout from "./Logout";

const Sidebar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="absolute h-screen">
      <div className="left-0 h-screen w-48 bg-gray-800 text-white">
        <ul className="list-none">
          <li className="font-sans p-4 hover:bg-gray-700 text-center">
            <Link to="/">Home</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 text-center">
            <Link to="/expenses">Expenses</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 text-center">
            <Link to="/connections">Connections</Link>
          </li>
          {isLoggedIn && (
            <li className="p-4 text-center bg-red-500">
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
