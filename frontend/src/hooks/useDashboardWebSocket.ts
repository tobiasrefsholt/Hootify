import {useWebSocket} from "@/hooks/useWebSocket.ts";
import {useEffect, useState} from "react";
import {GameOptions} from "@/Types.ts";

export function useDashboardWebSocket(gameId: string) {
    const url = import.meta.env.VITE_BACKEND_URL + '/dashboard/ws?gameId=' + gameId;

    // Import the base useWebSocket hook
    const {connectionRef, ...stateVariables} = useWebSocket(url);
    const [gameOptions, setGameOptions] = useState<GameOptions | null>(null);

    // Extend the useWebSocket hook to include the following:
    useEffect(() => {
        if (!connectionRef.current) return;

        connectionRef.current?.on("receiveGameOptions", (gameOptions: GameOptions) => {
            setGameOptions(gameOptions);
        });

    }, [connectionRef]);

    function sendNextQuestion() {
        connectionRef.current?.invoke("SendNextQuestion");
    }

    function sendLeaderboard() {
        connectionRef.current?.invoke("SendLeaderboard");
    }

    function sendAnswer() {
        connectionRef.current?.invoke("SendAnswer");
    }

    function updateGameOptions(gameOptions: GameOptions) {
        connectionRef.current?.invoke("UpdateGameOptions", gameOptions);
    }

    return {
        gameOptions,
        updateGameOptions,
        sendLeaderboard,
        sendNextQuestion,
        sendAnswer,
        ...stateVariables
    }
}