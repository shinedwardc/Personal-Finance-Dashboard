import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { useProfileContext } from "@/hooks/useProfileContext";
import { loginUser, googleLogin } from "@/api/user";

const Login = () => {
  const { authState, setAuthState } = useProfileContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      setAuthState({
        isLoggedIn: true,
        isPlaidConnected: authState.isPlaidConnected,
        isLoading: false,
      });
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password");
      console.error(error);
    }
  };

  const handleGoogleLogin = async (request: any) => {
    console.log("request", request);
    try {
      await googleLogin(request.credential);
      //const { access, refresh } = response.data;
      //console.log(access, refresh);
      //localStorage.setItem("accessToken", access);
      //localStorage.setItem("refreshToken", refresh);
      setAuthState({
        isLoggedIn: true,
        isPlaidConnected: authState.isPlaidConnected,
        isLoading: false,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          onLoginFormSubmit={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          error={error}
        />
      </div>
    </div>
  );
};

export default Login;
