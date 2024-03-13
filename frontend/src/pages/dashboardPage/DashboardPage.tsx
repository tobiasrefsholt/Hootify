import Sidebar from "@/pages/dashboardPage/sidebar/Sidebar.tsx";
import {Route, Routes} from "react-router-dom";
import GamesPage from "@/pages/dashboardPage/gamesPage/GamesPage.tsx";
import IndexPage from "@/pages/dashboardPage/indexPage/indexPage.tsx";
import QuestionsPage from "@/pages/dashboardPage/questionsPage/questionsPage.tsx";
import QuizzesPage from "@/pages/dashboardPage/quizzesPage/QuizzesPage.tsx";
import {useUser} from "@/context/userContext.tsx";
import {QuestionsProvider} from "@/context/questionsContext.tsx";
import {GamesProvider} from "@/context/gamesContext.tsx";
import {QuizzesProvider} from "@/context/quizzesContext.tsx";
import {CategoriesProvider} from "@/context/categoriesContext.tsx";
import CategoriesPage from "@/pages/dashboardPage/categoriesPage/categoriesPage.tsx";
import {useNavigate} from "react-router";
import {useEffect} from "react";

export default function DashboardPage() {
    const {userData, isPending} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData?.email && !isPending) navigate("/");
    }, [isPending, userData?.email]);

    if (!userData?.email && isPending) return "Logging in...";
    if (!userData?.email) {
        return "Redirecting...";
    }

    return (
        <QuestionsProvider>
            <GamesProvider>
                <CategoriesProvider>
                    <QuizzesProvider>
                        <div className="flex h-screen overflow-hidden">
                            <Sidebar/>
                            <div className="overflow-auto grow">
                                <Routes>
                                    <Route index={true} element={<IndexPage/>}></Route>
                                    <Route path="games/*" element={<GamesPage/>}></Route>
                                    <Route path="quizzes/*" element={<QuizzesPage/>}></Route>
                                    <Route path="questions/*" element={<QuestionsPage/>}></Route>
                                    <Route path="categories/*" element={<CategoriesPage/>}></Route>
                                </Routes>
                            </div>
                        </div>
                    </QuizzesProvider>
                </CategoriesProvider>
            </GamesProvider>
        </QuestionsProvider>
    )
}