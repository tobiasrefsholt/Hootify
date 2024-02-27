import Sidebar from "@/pages/dashboardPage/sidebar/Sidebar.tsx";
import {Route, Routes} from "react-router-dom";
import GamesPage from "@/pages/dashboardPage/gamesPage/GamesPage.tsx";
import IndexPage from "@/pages/dashboardPage/indexPage/indexPage.tsx";
import QuestionsPage from "@/pages/dashboardPage/questionsPage/questionsPage.tsx";
import QuizzesPage from "@/pages/dashboardPage/quizzesPage/QuizzesPage.tsx";
import {useUser} from "@/context/userContext.tsx";

export default function DashboardPage() {
    const {userData} = useUser();
    if (!userData?.email) return "Unauthorized";

    return (
        <div className="flex gap">
            <Sidebar/>
            <Routes>
                <Route index={true} element={<IndexPage/>}></Route>
                <Route path="games/*" element={<GamesPage/>}></Route>
                <Route path="quizzes/*" element={<QuizzesPage/>}></Route>
                <Route path="questions/*" element={<QuestionsPage/>}></Route>
            </Routes>
        </div>
    )
}