import {useWebSocket} from "@/hooks/useWebSocket.ts";

export function usePlayerWebSocket(playerId: string | null) {
    const url = import.meta.env.VITE_BACKEND_URL + '/ws?playerId=' + playerId
    const {connectionRef, ...stateVariables} = useWebSocket(url);

    function getGameState() {
        connectionRef.current?.invoke("GetGameState", playerId);
    }

    return  {
        getGameState,
        ...stateVariables
    }
}