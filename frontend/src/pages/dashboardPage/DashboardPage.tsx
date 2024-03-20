import Sidebar from "@/pages/dashboardPage/sidebar/Sidebar.tsx";
import {Route, Routes} from "react-router-dom";
import GamesPage from "@/pages/dashboardPage/gamesPage/GamesPage.tsx";
import IndexPage from "@/pages/dashboardPage/indexPage/indexPage.tsx";
import QuestionsPage from "@/pages/dashboardPage/questionsPage/questionsPage.tsx";
import QuizzesPage from "@/pages/dashboardPage/quizzesPage/quizzesPage.tsx";
import {useUser} from "@/context/userContext.tsx";
import {QuestionsProvider} from "@/context/questionsContext.tsx";
import {GamesProvider} from "@/context/gamesContext.tsx";
import {QuizzesProvider} from "@/context/quizzesContext.tsx";
import {CategoriesProvider} from "@/context/categoriesContext.tsx";
import CategoriesPage from "@/pages/dashboardPage/categoriesPage/categoriesPage.tsx";
import {useNavigate} from "react-router";
import AccountPage from "@/pages/dashboardPage/account/accountPage.tsx";
import PageContainer from "@/components/ui/pageContainer.tsx";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {useEffect} from "react";

export default function DashboardPage() {
    const {isPending: isPendingLogin, responseCode: loginResponse} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isPendingLogin && loginResponse !== 200)
            navigate("/");
    }, [isPendingLogin, loginResponse]);

    return (
        <QuestionsProvider>
            <GamesProvider>
                <CategoriesProvider>
                    <QuizzesProvider>
                        <div className="flex h-screen">
                            <Sidebar/>
                            <div className="flex-auto overflow-y-auto grow">
                                <Routes>
                                    <Route index={true} element={<IndexPage/>}></Route>
                                    <Route path="games/*" element={<GamesPage/>}></Route>
                                    <Route path="quizzes/*" element={<QuizzesPage/>}></Route>
                                    <Route path="questions/*" element={<QuestionsPage/>}></Route>
                                    <Route path="categories/*" element={<CategoriesPage/>}></Route>
                                    <Route path="account/*" element={<AccountPage/>}></Route>
                                    <Route path="*" element={<PageContainer><PageHeader>Page Not
                                        found</PageHeader></PageContainer>}></Route>
                                </Routes>
                            </div>
                        </div>
                    </QuizzesProvider>
                </CategoriesProvider>
            </GamesProvider>
        </QuestionsProvider>
    )
}