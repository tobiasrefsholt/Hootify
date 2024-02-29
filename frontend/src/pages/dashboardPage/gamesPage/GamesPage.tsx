import PageContainer from "@/components/ui/pageContainer.tsx";
import PageHeader from "@/components/ui/pageHeader.tsx";
import ActiveGames from "@/pages/dashboardPage/gamesPage/ActiveGames.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Route, Routes} from "react-router-dom";
import GameDetailsPage from "@/pages/dashboardPage/gamesPage/gameDetailsPage/GameDetailsPage.tsx";
import {useFetch} from "@/hooks/useFetch.ts";
import {ApiEndpoint, Game, GameState} from "@/Types.ts";
import {useEffect, useState} from "react";
import ArchivedGames from "@/pages/dashboardPage/gamesPage/ArchivedGames.tsx";

export default function GamesPage() {
    const games = useFetch<Game[]>(ApiEndpoint.DashboardGetAllGames, []);
    const [activeGames, setActiveGames] = useState<Game[]>([]);
    const [archivedGames, setArchivedGames] = useState<Game[]>([]);

    useEffect(() => {
        games.doFetch("POST");
    }, []);

    useEffect(() => {
        if (games.data) {
            setActiveGames(games.data.filter(game => game.state !== GameState.GameComplete));
            setArchivedGames(games.data.filter(game => game.state === GameState.GameComplete));
        }
    }, [games.data]);

    return (
        <Routes>
            <Route index={true} element={
                <PageContainer>
                    <PageHeader>Games</PageHeader>
                    <div className="space-y-10">
                        <ActiveGames activeGames={activeGames}/>
                        <Button variant="default">New Game</Button>
                        <ArchivedGames archivedGames={archivedGames}/>
                    </div>
                </PageContainer>
            }/>
            <Route path=":gameId" element={<GameDetailsPage/>}></Route>
        </Routes>
    )
}