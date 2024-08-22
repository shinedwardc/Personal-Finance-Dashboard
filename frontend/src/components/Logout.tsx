import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;