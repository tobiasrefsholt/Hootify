import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal} from "lucide-react";
import {Quiz} from "@/Types.ts";
import {useNavigate} from "react-router";
import RemoveQuizModal from "@/pages/dashboardPage/quizzesPage/removeQuizModal.tsx";
import {useQuizzes} from "@/context/quizzesContext.tsx";
import {useState} from "react";

type TableCellActionsProps = {
    row: { original: Quiz };
}

export default function TableCellActions({row}: TableCellActionsProps) {
    const navigate = useNavigate();
    const {remove: removeQuiz} = useQuizzes();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => navigate(row.original.id)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenDeleteModal(true)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
            <RemoveQuizModal open={openDeleteModal} setOpen={setOpenDeleteModal} children="" onConfirmDelete={() => removeQuiz([row.original.id])}/>
        </DropdownMenu>
    )
}