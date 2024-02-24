import {createContext, ReactNode, useContext, useState} from "react";
import {User, UserContextType} from "@/Types.ts";

const UserContext = createContext<UserContextType>({
    userData: null,
    login: () => {
    },
    logout: () => {
    }
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (user: User) => {
        setUser(user);
    };

    const logout = () => {
        setUser(null);
    };

    const userContextValue: UserContextType = {userData: user, login, logout};

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    )
}