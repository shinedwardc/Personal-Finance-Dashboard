import { useEffect, useState, createContext, Dispatch, SetStateAction, ReactNode } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAuthStatus, fetchProfileSettings, updateBudgetLimit } from "@/utils/api";

import { AuthState } from "@/interfaces/userAuth";
import { Settings } from "@/interfaces/settings";

export const ProfileContext = createContext<
  | {
        authState: AuthState;
        setAuthState: Dispatch<SetStateAction<AuthState>>;
        profileSettings: Settings;
        isProfileLoading: boolean;
        handleSettingsForm: (data: Settings) => void;
    }
  | undefined
>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {

    const queryClient = useQueryClient();

    const [authState, setAuthState] = useState<AuthState>({
        isLoggedIn: false,
        isPlaidConnected: false,
        isLoading: true,
    })

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

    const { data : profileSettings, isLoading : isProfileLoading} = useQuery({
        queryKey: ["settings", authState.isLoggedIn],
        queryFn: fetchProfileSettings,
        enabled: authState.isLoggedIn,
    });

    const mutation = useMutation({
        mutationFn: (data: Settings) => {
        return updateBudgetLimit(data);
        },
        onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ["settings", authState.isLoggedIn],
        });
        },
    });

    const handleSettingsForm = (data: Settings): void => {
        //updateBudgetLimit(data);
        mutation.mutate(data);
    };

    return (
        <ProfileContext.Provider
          value={{
            authState,
            setAuthState,
            profileSettings,
            isProfileLoading,
            handleSettingsForm
          }}>
            {children}
        </ProfileContext.Provider>
    )
}