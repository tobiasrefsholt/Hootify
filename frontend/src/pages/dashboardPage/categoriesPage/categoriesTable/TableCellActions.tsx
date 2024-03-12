import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal} from "lucide-react";
import {Category} from "@/Types.ts";
import {useNavigate} from "react-router";
import RemoveCategoryModal from "@/pages/dashboardPage/categoriesPage/removeCategoryModal.tsx";
import {useState} from "react";
import {useCategories} from "@/context/categoriesContext.tsx";

type TableCellActionsProps = {
    row: { original: Category };
}

export default function TableCellActions({row}: TableCellActionsProps) {
    const navigate = useNavigate();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const {remove: removeCategory} = useCategories();
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
                <DropdownMenuItem
                    onClick={() => navigate(row.original.id)}
                >
                    Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenDeleteModal(true)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
            <RemoveCategoryModal open={openDeleteModal} setOpen={setOpenDeleteModal} onConfirmDelete={() => removeCategory([row.original.id])} children=""/>
        </DropdownMenu>
    )
}