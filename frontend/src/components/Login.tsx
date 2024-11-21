import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthState } from "../interfaces/interface";

const Login = ({
  authState,
  setAuthState,
}: {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });
      const { access, refresh } = response.data; // Assuming JWT tokens
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      setAuthState({
        isLoggedIn: true,
        isPlaidConnected: authState.isPlaidConnected,
        isLoading: false,
      });
      navigate("/"); // Redirect to homepage after login
    } catch (error) {
      setError("Invalid username or password");
      console.error(error);
    }
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="text-center mb-4 font-bold font-ubuntu">
        <h1>Login</h1>
      </div>
      <div className="mb-2">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Username:
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
          />
        </div>
      </div>
      <div className="mb-2">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password:
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
          />
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="flex flex-wrap gap-5">
        <button
          className="ml-7 mt-1 p-2 text-white border-red-500 bg-red-500 rounded-lg"
          type="submit"
        >
          Login
        </button>
        <button
          className="mt-1 p-2 text-white bg-green-400 rounded-lg"
          onClick={handleSignUpClick}
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default Login;
