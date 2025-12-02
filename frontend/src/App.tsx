import { useExpenseContext } from "./hooks/useExpenseContext";
import { useProfileContext } from "./hooks/useProfileContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { ModeToggle } from "./components/modeToggle";
import Navbar from "./components/Navbar";
import Introduction from "./components/Introduction";
import Breakdown from "./components/Breakdown";
import Dashboard from "./components/Dashboard";
import List from "./components/List";
import Calendar from "./components/ExpenseCalendar";
import Stats from "./components/Stats";
import Investments from "./components/Investments";
import Profile from "./components/Profile";
import PrivateRoute from "./components/privateRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PasswordRecovery from "./components/PasswordRecovery";
import { PlaidResponse } from "./interfaces/plaid";

function App() {
  const { data, isDataLoading, handleSettingsForm, plaidBalance } =
    useExpenseContext();

  const { authState, setAuthState, profileSettings, isProfileLoading } =
    useProfileContext();

  return (
    <Router>
      <ToastContainer />
      <ThemeProvider storageKey="vite-ui-theme">
        <div className="min-h-screen dark:bg-black dark:text-white overflow-auto font-inter">
          <div className="container mx-auto">
            <Navbar />
            {/*<ExpenseProvider data={data} setData={setData} isDataLoading={isDataLoading}>*/}
            <div className="flex flex-col items-center justify-center">
              <Routes>
                {/* Public routes */}
                <Route path="/about" element={<Introduction />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/recover" element={<PasswordRecovery />} />
                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard plaidBalance={plaidBalance as PlaidResponse} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard plaidBalance={plaidBalance as PlaidResponse} />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <PrivateRoute>
                      <List />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/investments"
                  element={
                    <PrivateRoute>
                      <Investments />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <PrivateRoute>
                      <Calendar />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/stats"
                  element={
                    <PrivateRoute>
                      <Stats />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
            {/*</ExpenseProvider>*/}
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
