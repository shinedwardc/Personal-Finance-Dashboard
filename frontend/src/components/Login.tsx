import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Bounce } from 'react-toastify';

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.success) {
      toast.success('Sign up success!', {
        toastId: 'signupSuccess',
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
      navigate('/login', {replace: true, state: {}});
    }
  },[location.state, navigate])

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
      setIsLoggedIn(true);
      navigate("/"); // Redirect to homepage after login
    } catch (error) {
      setError("Invalid username or password");
      console.error(error);
    }
  };

  const handleSignUpClick = () => {
    navigate("/signup")
  }

  return (
    <form onSubmit={handleLogin}>
      <div className="text-center mb-4 font-bold font-ubuntu">
        <h1>Login</h1>
      </div>
      <div className="mb-2">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Username:
        </label>
        <input
          type="text"
          value={username}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password:
        </label>
        <input
          type="password"
          value={password}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="flex flex-wrap gap-5">
        <button
          className="ml-7 mt-1 p-2 text-white border-red-500 bg-red-500 rounded-lg"
          type="submit"
        >
          Login
        </button>
        <button className="mt-1 text-white bg-green-400 rounded-lg" onClick={handleSignUpClick}>
          Sign up
        </button>
      </div>

    </form>
  );
};

export default Login;
