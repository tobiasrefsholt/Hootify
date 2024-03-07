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
import QuestionSheet from "@/pages/dashboardPage/questionsPage/editQuestionModal/questionSheet.tsx";
import {useState} from "react";
import RemoveQuestionModal from "@/pages/dashboardPage/questionsPage/removeQuestionModal.tsx";
import {useQuestions} from "@/context/questionsContext.tsx";

type TableCellActionsProps = {
    row: { original: QuestionWithAnswer };
}

export default function TableCellActions({row}: TableCellActionsProps) {
    const [openEditSheet, setOpenEditSheet] = useState(false);
    const [openRemoveModal, setOpenRemoveModal] = useState(false);
    const {remove: removeQuestion} = useQuestions();
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
                    onClick={() => navigator.clipboard.writeText(row.original.title)}
                >
                    Copy question
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => setOpenEditSheet(true)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenRemoveModal(true)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
            <QuestionSheet
                question={row.original}
                children=""
                open={openEditSheet}
                setOpen={setOpenEditSheet}
            />
            <RemoveQuestionModal
                open={openRemoveModal}
                setOpen={setOpenRemoveModal}
                onConfirmDelete={() => removeQuestion(row.original.id)}
                children=""
            />
        </DropdownMenu>
    )
}