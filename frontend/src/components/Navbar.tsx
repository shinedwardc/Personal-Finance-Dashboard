import { Link, useNavigate } from "react-router-dom";

const Navbar = ({
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
        <div className="drawer w-full text-white ">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="navbar bg-green-800 w-full rounded mt-2">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2">Expense Tracker</div>
            <div className="hidden flex-none lg:block">
              <ul className="menu menu-horizontal">
                <li className="font-sans p-4 text-center">
                  <Link to="/">Summary</Link>
                </li>
                <li className="p-4 text-center">
                  <Link to="/expenses">Expenses</Link>
                </li>
                <li className="p-4 text-center">
                  <Link to="/calendar">Calendar</Link>
                </li>
                <li className="p-4 text-center">
                  <Link to="/connections">Connections</Link>
                </li>
                <li className="p-4 text-center bg-red-500">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="drawer-side z-10">
            <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 min-h-full w-80 p-4">
              <li className="font-sans p-4 hover:bg-green-400 text-center">
                <Link to="/">Summary</Link>
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
        </div>
      ) : null}
    </>
  );
};

export default Navbar;
