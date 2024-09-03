import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
}

interface LogoutProps {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const Logout = ({ setAuthState }: LogoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    setAuthState({ isLoggedIn: false, isLoading: false });
    navigate('/login');
  }, [setAuthState, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;