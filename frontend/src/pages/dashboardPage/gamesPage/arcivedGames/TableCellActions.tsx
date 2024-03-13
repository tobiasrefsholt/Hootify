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
import {Game, GameState} from "@/Types.ts";
import {useNavigate} from "react-router";
import RemoveGameModal from "@/pages/dashboardPage/gamesPage/gameArchivePage/removeGameModal.tsx";
import {useState} from "react";
import {useGames} from "@/context/gamesContext.tsx";

type TableCellActionsProps = {
    row: { original: Game };
}

export default function TableCellActions({row}: TableCellActionsProps) {
    const navigate = useNavigate();
    const {remove: removeGames} = useGames();
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
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {row.original.state === GameState.WaitingForPlayers &&
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(row.original.shareKey)}
                    >
                        Copy share key
                    </DropdownMenuItem>
                }
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => navigate(row.original.id)}>
                    Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenRemoveModal(true)}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
            <RemoveGameModal
                open={openRemoveModal}
                setOpen={setOpenRemoveModal}
                onConfirmDelete={() => removeGames([row.original.id])} children={""}
            />
        </DropdownMenu>
    )
}