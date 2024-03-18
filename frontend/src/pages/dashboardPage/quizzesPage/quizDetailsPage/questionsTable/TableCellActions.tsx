import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
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
    const {quizzes} = useQuizzes();
    const currentQuiz = useMemo(() => quizzes.find(quiz => quiz.id === quizId), [quizzes, quizId]);
    const [openRemoveModal, setOpenRemoveModal] = useState(false);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Quiz Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => setOpenRemoveModal(true)}
                >
                    Remove from quiz
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuLabel>Global actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
            <RemoveFromQuizModal
                open={openRemoveModal}
                setOpen={setOpenRemoveModal}
                children={""}
                onConfirmDelete={() => {console.log(`remove question: ${row.original.title} from quiz + ${currentQuiz?.id})}`)}}
            />
        </DropdownMenu>
    )
}