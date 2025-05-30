import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProfileProvider } from "./context/ProfileContext.tsx";
import { ExpenseProvider } from "./context/ExpenseContext.tsx";
import { CalendarProvider } from "./context/CalendarContext.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <StrictMode>
        <ProfileProvider>
          <ExpenseProvider>
            <CalendarProvider>
              <App />
            </CalendarProvider>
          </ExpenseProvider>
        </ProfileProvider>
      </StrictMode>
    </GoogleOAuthProvider>
  </QueryClientProvider>,
);
