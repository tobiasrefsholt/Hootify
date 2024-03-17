import {Route, Routes} from "react-router-dom";
import QuizzesArchivePage from "@/pages/dashboardPage/quizzesPage/quizzesArchive/QuizzesArchivePage.tsx";
import QuizDetailsPage from "@/pages/dashboardPage/quizzesPage/quizDetailsPage/quizDetailsPage.tsx";

export default function QuizzesPage() {
    return (
        <Routes>
            <Route index={true} element={<QuizzesArchivePage/>} />
            <Route path=":quizId" element={<QuizDetailsPage/>} />
        </Routes>
    )
}