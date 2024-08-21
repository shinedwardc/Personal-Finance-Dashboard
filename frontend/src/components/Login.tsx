import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e : React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      const { access, refresh } = response.data; // Assuming JWT tokens
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setIsLoggedIn(true);
      navigate('/');  // Redirect to homepage after login
    } catch (error) {
      setError('Invalid username or password');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username:</label>
        <input
          type="text"
          value={username}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password:</label>
        <input
          type="password"
          value={password}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;