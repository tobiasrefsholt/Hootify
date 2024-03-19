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
import {Button} from "@/components/ui/button.tsx";
import RemoveFromQuizModal from "@/pages/dashboardPage/quizzesPage/quizDetailsPage/remvoeFromQuizModal.tsx";

export default function QuizDetailsPage() {
    const {quizzes, edit:editQuizzes} = useQuizzes();
    const {questions} = useQuestions();
    const {quizId} = useParams();
    const selectedQuiz = useMemo(
        () => quizzes.find(quiz => quiz.id === quizId),
        [quizzes, quizId]
    );
    const questionsForQuiz = useMemo<QuestionWithAnswer[]>(
        () => selectedQuiz?.questionIds.map(questionId => questions
            .find(question => question.id === questionId))
            .filter(question => question !== undefined) as QuestionWithAnswer[]
        , [questions, selectedQuiz?.questionIds]);

    const [rowSelection, setRowSelection] = useState({});
    const selectedIds = useMemo(() => {
        const indexes = Object.keys(rowSelection);
        return indexes.map(index => questions[parseInt(index)].id);
    }, [rowSelection]);

    const [openRemoveModal, setOpenRemoveModal] = useState(false);

    function handleRemoveSelected() {
        if (!selectedQuiz) return;
        const newQuestionIds = selectedQuiz.questionIds.filter(questionId => !selectedIds.includes(questionId));
        editQuizzes({...selectedQuiz, questionIds: newQuestionIds});
    }

    if (!selectedQuiz)
        return (<p>Quiz not found</p>)

    return (
        <PageContainer>
            <Link to=".." className="flex mb-5 gap-2.5"><ArrowLeft/>Return to quizzes</Link>
            <PageHeader>{selectedQuiz.title}</PageHeader>
            <div className="mb-10 flex gap-2.5">
                <Button variant="secondary">Delete quiz</Button>
                {selectedIds.length > 0 && <>
                    <RemoveFromQuizModal
                        open={openRemoveModal}
                        setOpen={setOpenRemoveModal}
                        onConfirmDelete={() => handleRemoveSelected()}
                    >
                        <Button
                            variant="outline"
                            onClick={() => console.log(rowSelection)}
                        >
                            Remove from quiz
                        </Button>
                    </RemoveFromQuizModal>
                </>}
            </div>
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