import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '../interfaces/interface';


interface LogoutProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const Logout = ({ authState, setAuthState }: LogoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthState({ isLoggedIn: false, isPlaidConnected: authState.isPlaidConnected, isLoading: false });
    navigate('/login');
  }, [setAuthState, navigate, authState]);

  return <div>Logging out...</div>;
};

export default Logout;