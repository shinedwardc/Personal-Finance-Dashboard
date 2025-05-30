import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileContext } from "@/hooks/useProfileContext";

const Logout = () => {

  const { authState, setAuthState } = useProfileContext();

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthState({
      isLoggedIn: false,
      isPlaidConnected: authState.isPlaidConnected,
      isLoading: false,
    });
    navigate("/login");
  }, [setAuthState, navigate, authState]);

  return <div>Logging out...</div>;
};

export default Logout;
