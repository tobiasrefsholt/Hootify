import {createContext, ReactNode, useContext, useEffect} from "react";
import {ApiEndpoint, Game, GamesContextType} from "@/Types.ts";
import {useFetch} from "@/hooks/useFetch.ts";
import {toast} from "sonner";

const GameContext = createContext<GamesContextType>({
    games: [],
    isPending: true,
    error: null,
    add: () => {
    },
    remove: () => {
    }
});

type UserProviderProps = {
    children: ReactNode
}
export const useGames = () => useContext(GameContext);

export const GamesProvider = ({children}: UserProviderProps) => {
    const {
        data: games,
        isPending,
        error,
        doFetch
    } = useFetch<Game[]>(ApiEndpoint.DashboardGetAllGames, []);

    const addFetch = useFetch<null>(ApiEndpoint.DashboardAddGame, []);
    const deleteFetch = useFetch<null>(ApiEndpoint.DashboardDeleteGame, []);

    // Fetch questions on mount
    useEffect(() => {
        doFetch("POST", [], null);
    }, []);

    function add(game: Game) {
        addFetch.doFetch("POST", [], game, () => {
            toast("Game added");
            // Fetch questions after adding
            doFetch("POST", [], null);
        });
    }

    function remove(ids: string[]) {
        deleteFetch.doFetch("POST", [], ids, () => {
            toast(ids.length > 1 ? ids.length + " games deleted" : "Game deleted");
            // Fetch questions after deleting
            doFetch("POST", [], null);
        });
    }

    const gamesContextValue: GamesContextType = {
        games: games || [],
        isPending,
        error,
        add,
        remove
    };

    return (
        <GameContext.Provider value={gamesContextValue}>
            {children}
        </GameContext.Provider>
    )
}