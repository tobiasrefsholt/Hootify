import {useWebSocket} from "@/hooks/useWebSocket.ts";
import {useEffect} from "react";

export function useDashboardWebSocket(gameId: string) {
    const url = import.meta.env.VITE_BACKEND_URL + '/dashboard/ws?gameId=' + gameId;

    // Import the base useWebSocket hook
    const {connectionRef, ...stateVariables} = useWebSocket(url);

    // Extend the useWebSocket hook to include the following:
    useEffect(() => {
        if (!connectionRef.current) return;

    }, [connectionRef]);

    function sendAnswer() {
        connectionRef.current?.invoke("SendAnswer");
    }

    return {
        sendAnswer,
        ...stateVariables
    }
}