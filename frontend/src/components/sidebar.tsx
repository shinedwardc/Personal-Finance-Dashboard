import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({
  authState,
  setAuthState,
}: {
  authState: {
    isLoggedIn: boolean;
    isPlaidConnected: boolean;
    isLoading: boolean;
  };
  setAuthState: (authState: {
    isLoggedIn: boolean;
    isPlaidConnected: boolean;
    isLoading: boolean;
  }) => void;
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthState({
      isLoggedIn: false,
      isPlaidConnected: authState.isPlaidConnected,
      isLoading: false,
    });
    navigate("/login");
  };

  return (
    <>
      {authState.isLoggedIn ? (
        <div className="fixed left-0 top-0 h-screen w-48 bg-green-800 text-white">
          <ul className="list-none">
            <li className="font-sans p-4 hover:bg-green-400 text-center">
              <Link to="/">Home</Link>
            </li>
            <li className="p-4 hover:bg-green-400 text-center">
              <Link to="/expenses">Expenses</Link>
            </li>
            <li className="p-4 hover:bg-green-400 text-center">
              <Link to="/calendar">Calendar</Link>
            </li>
            <li className="p-4 hover:bg-green-400 text-center">
              <Link to="/connections">Connections</Link>
            </li>
            <li className="p-4 text-center bg-red-500">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;
