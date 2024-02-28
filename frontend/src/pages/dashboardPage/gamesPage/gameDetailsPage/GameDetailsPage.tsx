import PageContainer from "@/components/ui/pageContainer.tsx";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {Link} from "react-router-dom";
import {ArrowLeft} from "lucide-react";
import {useFetch} from "@/hooks/useFetch.ts";
import {ApiEndpoint, Game} from "@/Types.ts";
import {useParams} from "react-router";
import {useEffect} from "react";
import {useDashboardWebSocket} from "@/hooks/useDashboardWebSocket.ts";
import LeaderboardCard from "@/pages/dashboardPage/gamesPage/gameDetailsPage/LeaderboardCard.tsx";
import GameDetailsCard from "@/pages/dashboardPage/gamesPage/gameDetailsPage/GameDetailsCard.tsx";
import ChatCard from "@/pages/dashboardPage/gamesPage/gameDetailsPage/ChatCard.tsx";
import ActiveStateActions
    from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/ActiveStateActions.tsx";

export default function GameDetailsPage() {
    const {gameId} = useParams();
    const game = useFetch<Game>(ApiEndpoint.DashboardGetGame, []);
    const {
        gameOptions,
        gameState,
        questionWithAnswer,
        leaderBoard,
        sendChatMessage,
        sendNextQuestion,
        sendLeaderboard,
        sendAnswer,
        updateGameOptions
    } = useDashboardWebSocket(gameId || "");

    useEffect(() => {
        if (!gameId) return;
        game.doFetch("POST", [gameId]);
    }, [gameId])

    return (
        <PageContainer>
            <Link to=".." className="flex mb-5 gap-2.5"><ArrowLeft/> Return to games</Link>
            <PageHeader>{gameOptions?.title}</PageHeader>
            <div className="grid grid-cols-2 gap-5">
                <ActiveStateActions
                    gameState={gameState}
                    questionWithAnswer={questionWithAnswer}
                    sendNextQuestion={sendNextQuestion}
                    sendLeaderboard={sendLeaderboard}
                    sendAnswer={sendAnswer}/>
                <GameDetailsCard gameState={gameState} game={game.data} gameOptions={gameOptions} onChange={updateGameOptions}/>
                <LeaderboardCard players={leaderBoard}/>
                <ChatCard sendChatMessage={sendChatMessage}/>
            </div>
        </PageContainer>
    )
}