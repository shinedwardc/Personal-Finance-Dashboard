import {
  useEffect,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getAuthStatus,
  fetchUserSettings,
  updateBudgetSettings,
  updateDisplaySettings,
} from "@/api/user";

import { AuthState } from "@/interfaces/userAuth";
import { BudgetSettings, DisplaySettings } from "@/interfaces/settings";

type SettingsKind = "budget" | "display";

interface BaseSettingsUpdate {
  kind: SettingsKind;
}

interface BudgetSettingsUpdate extends BaseSettingsUpdate {
  kind: "budget";
  monthlyBudget?: number;
  categoryLimits?: Record<string, number>[];
  overSpendingThreshold?: number;
}

interface DisplaySettingsUpdate extends BaseSettingsUpdate {
  kind: "display";
  currency?: string;
  timeZone?: string;
  dateFormat?: string;
  defaultDashboardRange?: "month" | "quarter" | "year" | "all";
  notifactionsEnabled?: boolean;
  incomeAffectsBudget?: boolean;
}

type SettingsUpdate =
| BudgetSettingsUpdate
| DisplaySettingsUpdate;

export const SettingsContext = createContext<
  | {
      authState: AuthState;
      setAuthState: Dispatch<SetStateAction<AuthState>>;
      userSettings: BudgetSettings & DisplaySettings;
      isUserSettingsLoading: boolean;
      handleSettingsForm: (data: SettingsUpdate) => void;
    }
  | undefined
>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    isPlaidConnected: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const response = await getAuthStatus();
      const plaidToken = localStorage.getItem("plaidAccessToken");
      setAuthState({
        isLoggedIn: response.authenticated,
        isPlaidConnected: Boolean(plaidToken),
        isLoading: false,
      });
    };
    checkAuth();
  }, []);


  const { data: userSettings, isLoading: isUserSettingsLoading } = useQuery({
    queryKey: ["userSettings", authState.isLoggedIn],
    queryFn: fetchUserSettings,
    enabled: authState.isLoggedIn,
  });

  const mutation = useMutation({
    mutationFn: (data: SettingsUpdate) => {
      switch (data.kind) {
        case "budget":
          return updateBudgetSettings(data);
        case "display":
          return updateDisplaySettings(data);
        default:
          throw new Error("Invalid settings update");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userSettings", authState.isLoggedIn],
      });
    },
  });

  const handleSettingsForm = (data: SettingsUpdate): void => {
    mutation.mutate(data);
  };

  return (
    <SettingsContext.Provider
      value={{
        authState,
        setAuthState,
        userSettings,
        isUserSettingsLoading,
        handleSettingsForm,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
