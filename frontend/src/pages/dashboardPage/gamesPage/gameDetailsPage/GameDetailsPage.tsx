import PageContainer from "@/components/ui/pageContainer.tsx";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {Link} from "react-router-dom";
import {ArrowLeft} from "lucide-react";
import {useFetch} from "@/hooks/useFetch.ts";
import {ApiEndpoint, Game, GameState, Player} from "@/Types.ts";
import {useParams} from "react-router";
import {useEffect} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useDashboardWebSocket} from "@/hooks/useDashboardWebSocket.ts";

export default function GameDetailsPage() {
    const {gameId} = useParams();
    const game = useFetch<Game>(ApiEndpoint.DashboardGetGame, []);
    const {
        gameState,
        players,
        question,
        questionWithAnswer,
        leaderBoard,
        answerQuestion,
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
                <Card>
                    <CardHeader>Leaderboard</CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players?.map((player: Player, index: number) =>
                                    <TableRow key={player.id}>
                                        <TableCell>{index}</TableCell>
                                        <TableCell>{player.name}</TableCell>
                                        <TableCell className="text-right">{player.score}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>Game Details</CardHeader>
                    <CardContent>
                        <p>State:</p>
                        <p className="mb-5 font-bold">{GameState[gameState || 0]}</p>
                        <p>ShareKey:</p>
                        <p className="text-5xl">{game.data?.shareKey || "N/A"}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>Current Question</CardHeader>
                    <CardContent>
                        <p>Question:</p>
                        <p className="mb-5 font-bold">{question?.title}</p>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    )
}