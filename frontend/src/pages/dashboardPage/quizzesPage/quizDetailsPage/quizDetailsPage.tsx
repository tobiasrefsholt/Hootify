import {useQuizzes} from "@/context/quizzesContext.tsx";
import PageContainer from "@/components/ui/pageContainer.tsx";
import {useParams} from "react-router";

export default function QuizDetailsPage() {
    const {quizzes} = useQuizzes();
    const {quizId} = useParams();
    const selectedQuiz = quizzes.find(quiz => quiz.id === quizId);

    if (!selectedQuiz)
        return (<p>Quiz not found</p>)

    return (
        <PageContainer>
            <h1>Quiz details</h1>
        </PageContainer>
    )
}