import {useQuizzes} from "@/context/quizzesContext.tsx";
import PageContainer from "@/components/ui/pageContainer.tsx";
import {useParams} from "react-router";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {ArrowLeft} from "lucide-react";
import {Link} from "react-router-dom";
import {useMemo, useState} from "react";
import {useQuestions} from "@/context/questionsContext.tsx";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/quizzesPage/quizDetailsPage/questionsTable/TableColumns.tsx";
import {QuestionWithAnswer} from "@/Types.ts";

export default function QuizDetailsPage() {
    const {quizzes} = useQuizzes();
    const {questions} = useQuestions();

    const {quizId} = useParams();
    const selectedQuiz = quizzes.find(quiz => quiz.id === quizId);

    const questionsForQuiz = useMemo<QuestionWithAnswer[]>(() => {
        return selectedQuiz?.questionIds.map(questionId => questions
            .find(question => question.id === questionId))
            .filter(question => question !== undefined) as QuestionWithAnswer[];
    }, [questions, quizId]);

    const [rowSelection, setRowSelection] = useState({});

    if (!selectedQuiz)
        return (<p>Quiz not found</p>)

    return (
        <PageContainer>
            <Link to=".." className="flex mb-5 gap-2.5"><ArrowLeft/>Return to quizzes</Link>
            <PageHeader>{selectedQuiz.title}</PageHeader>
            <DataTable
                columns={tableColumns}
                data={questionsForQuiz || []}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                filterByColumn={"title"}
                filterText={"questions"}
            />
        </PageContainer>
    )
}