import {createContext, ReactNode, useContext, useEffect} from "react";
import {ApiEndpoint, UserContextType} from "@/Types.ts";
import {useFetch} from "@/hooks/useFetch.ts";

const UserContext = createContext<UserContextType>({
    userData: null,
    isPending: false,
    responseCode: null,
    fetch: () => {
    },
    logout: () => {
    }
});

type UserProviderProps = {
    children: ReactNode
}
export const useUser = () => useContext(UserContext);

type ManageInfoResponse = {
    "email": "string",
    "isEmailConfirmed": true
}

export const UserProvider = ({children}: UserProviderProps) => {
    const {doFetch: logOutUser, isPending: pendingLogout} = useFetch<null>(ApiEndpoint.Logout, []);
    const {
        data: user,
        doFetch: fetchUser,
        isPending,
        responseCode,
        error
    } = useFetch<ManageInfoResponse>(ApiEndpoint.ManageInfo, [pendingLogout]);

    // Fetch user data on mount
    useEffect(() => {
        fetch();
    }, []);

    // Set user data on fetch response
    useEffect(() => {
        if (error) logout();
        console.log(fetchUser);
    }, [user?.email, error]);

    const fetch = () => {
        fetchUser("GET", [], null);
    };

    const logout = () => {
        logOutUser("POST", [], null);
    };

    const userContextValue: UserContextType = {
        userData: user,
        isPending: isPending,
        responseCode: responseCode,
        fetch,
        logout
    };

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    )
}