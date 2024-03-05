import {Route, Routes} from "react-router-dom";
import GameDetailsPage from "@/pages/dashboardPage/gamesPage/gameDetailsPage/GameDetailsPage.tsx";
import GameArchivePage from "@/pages/dashboardPage/gamesPage/gameArchivePage/GameArchivePage.tsx";

export default function GamesPage() {
    return (
        <Routes>
            <Route index={true} element={<GameArchivePage/>}/>
            <Route path=":gameId" element={<GameDetailsPage/>}></Route>
        </Routes>
    )
}