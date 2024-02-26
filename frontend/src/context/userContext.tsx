import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {ApiEndpoint, User, UserContextType} from "@/Types.ts";
import {useFetch} from "@/hooks/useFetch.ts";

const UserContext = createContext<UserContextType>({
    userData: null,
    login: () => {
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
    const [user, setUser] = useState<User | null>(null);
    const fetchUser = useFetch<ManageInfoResponse>(ApiEndpoint.ManageInfo, []);
    const fetchLogout = useFetch<null>(ApiEndpoint.Logout, []);

    // Fetch user data on mount
    useEffect(() => {
        fetchUser.doFetch("GET", [], null);
    }, []);

    // Set user data on fetch response
    useEffect(() => {
        if (fetchUser.error) logout();
        if (fetchUser.data) login({email: fetchUser.data.email});
    }, [fetchUser.data?.email, fetchUser.error]);

    const login = (user: User) => {
        setUser(user);
    };

    const logout = () => {
        fetchLogout.doFetch("POST", [], null);
        setUser(null);
    };

    const userContextValue: UserContextType = {userData: user, login, logout};

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    )
}