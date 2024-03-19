import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal} from "lucide-react";
import {QuestionWithAnswer} from "@/Types.ts";
import {useQuizzes} from "@/context/quizzesContext.tsx";
import {useParams} from "react-router";
import {useMemo, useState} from "react";
import RemoveFromQuizModal from "@/pages/dashboardPage/quizzesPage/quizDetailsPage/remvoeFromQuizModal.tsx";

type TableCellActionsProps = {
    row: { original: QuestionWithAnswer };
}

export default function TableCellActions({row}: TableCellActionsProps) {
    const {quizId} = useParams();
    const {quizzes, edit: editQuizzes} = useQuizzes();
    const currentQuiz = useMemo(() => quizzes.find(quiz => quiz.id === quizId), [quizzes, quizId]);
    const [openRemoveModal, setOpenRemoveModal] = useState(false);

    function handleRemoveQuestionFromQuiz() {
        if (!currentQuiz) return;
        const newQuestionIds = currentQuiz.questionIds
            .filter(questionId => questionId !== row.original.id);
        editQuizzes({...currentQuiz, questionIds: newQuestionIds});
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => setOpenRemoveModal(true)}
                >
                    Remove from quiz
                </DropdownMenuItem>
            </DropdownMenuContent>
            <RemoveFromQuizModal
                open={openRemoveModal}
                setOpen={setOpenRemoveModal}
                children={""}
                onConfirmDelete={() => handleRemoveQuestionFromQuiz}
            />
        </DropdownMenu>
    )
}