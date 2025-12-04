import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useProfileContext } from "@/hooks/useProfileContext";
import { LayoutDashboard, ScrollText, CalendarDays, ChartLine, UserRoundPen } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const { authState, setAuthState } = useProfileContext();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        {
          withCredentials: true,
        },
      );
      setAuthState({
        isLoggedIn: false,
        isPlaidConnected: authState.isPlaidConnected,
        isLoading: false,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!authState.isLoading && (
        <nav className="flex flex-row w-full justify-between items-center gap-x-2 md:mt-5">
          <div
            className={`${authState.isLoggedIn ? "min-w-max" : "w-1/2 text-center mt-5"}`}
          >
            <h1 className="text-4xl font-bold">Expense Tracker</h1>
          </div>
          {authState.isLoggedIn ? (
            <>
              <div className="min-w-max text-center break-words">
                <ul className="flex flex-row gap-x-4">
                  <li className="p-4 flex items-center">
                    <Link to="/dashboard" className="flex flex-row gap-x-1">
                        <LayoutDashboard />
                        Dashboard
                    </Link>
                  </li>
                  <li className="p-4 flex items-center">
                    <Link to="/transactions" className="flex flex-row gap-x-1">
                        <ScrollText />
                        Transactions
                    </Link>
                  </li>
                  <li className="p-4 flex items-center">
                    <Link to="/calendar" className="flex flex-row gap-x-1">
                      <CalendarDays />
                      Calendar
                    </Link>
                  </li>
                  <li className="p-4 flex items-center">
                    <Link to="/stats" className="flex flex-row gap-x-1">
                      <ChartLine />
                      Graph
                    </Link>
                  </li>
                  <li className="p-4 flex items-center">
                    <Link to="/profile" className="flex flex-row gap-x-1">
                      <UserRoundPen />
                      Profile
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="lg:w-[280px]">
                <button
                  className="p-3 bg-primary-light dark:bg-ternary-dark text-white font-semibold"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="w-1/2 text-white flex flex-row justify-center gap-x-2">
              <Link to="/login" className="text-sm font-semibold">
                <button className="p-3 bg-primary-light dark:bg-ternary-dark">
                  Log in
                </button>
              </Link>
            </div>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;
