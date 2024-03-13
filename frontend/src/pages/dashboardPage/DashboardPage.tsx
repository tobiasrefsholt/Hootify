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
import {useMemo} from "react";
import AccountPage from "@/pages/dashboardPage/account/accountPage.tsx";
import PageContainer from "@/components/ui/pageContainer.tsx";
import PageHeader from "@/components/ui/pageHeader.tsx";

export default function DashboardPage() {
    const {userData, isPending, responseCode} = useUser();
    const navigate = useNavigate();

    const doRedirect = useMemo(
        () => !userData?.email && !isPending && responseCode !== 200,
        [userData?.email, isPending, responseCode]
    );

    if (doRedirect) navigate("/");

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
                                    <Route path="account/*" element={<AccountPage/>}></Route>
                                    <Route path="*" element={<PageContainer><PageHeader>Page Not found</PageHeader></PageContainer>}></Route>
                                </Routes>
                            </div>
                        </div>
                    </QuizzesProvider>
                </CategoriesProvider>
            </GamesProvider>
        </QuestionsProvider>
    )
}