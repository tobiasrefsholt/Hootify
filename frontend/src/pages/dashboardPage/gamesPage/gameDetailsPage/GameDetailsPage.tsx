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
import CurrentQuestionCard from "@/pages/dashboardPage/gamesPage/gameDetailsPage/CurrentQuestionCard.tsx";
import ChatCard from "@/pages/dashboardPage/gamesPage/gameDetailsPage/ChatCard.tsx";

export default function GameDetailsPage() {
    const {gameId} = useParams();
    const game = useFetch<Game>(ApiEndpoint.DashboardGetGame, []);
    const {
        gameState,
        questionWithAnswer,
        leaderBoard,
        sendChatMessage
    } = useDashboardWebSocket(gameId || "");

    useEffect(() => {
        if (!gameId) return;
        game.doFetch("POST", [gameId]);
    }, [gameId])

    return (
        <PageContainer>
            <Link to=".." className="flex mb-5 gap-2.5"><ArrowLeft/> Return to games</Link>
            <PageHeader>{game.data?.title}</PageHeader>
            <div className="grid grid-cols-2 gap-5">
                <CurrentQuestionCard question={questionWithAnswer}/>
                <GameDetailsCard gameState={gameState} game={game.data}/>
                <LeaderboardCard players={leaderBoard}/>
                <ChatCard sendChatMessage={sendChatMessage}/>
            </div>
        </PageContainer>
    )
}