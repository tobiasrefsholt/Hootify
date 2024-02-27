import PageContainer from "@/components/ui/pageContainer.tsx";
import PageHeader from "@/components/ui/pageHeader.tsx";
import ActiveGames from "@/pages/dashboardPage/gamesPage/ActiveGames.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Route, Routes} from "react-router-dom";
import GameDetailsPage from "@/pages/dashboardPage/gamesPage/gameDetailsPage/GameDetailsPage.tsx";

export default function GamesPage() {
    return (
        <Routes>
            <Route index={true} element={
                <PageContainer>
                    <PageHeader>Games</PageHeader>
                    <Button variant="default">New Game</Button>
                    <ActiveGames/>
                </PageContainer>
            }/>
            <Route path=":gameId" element={<GameDetailsPage/>}></Route>
        </Routes>
    )
}