import PageHeader from "@/components/ui/pageHeader.tsx";
import NewGameModal from "@/pages/dashboardPage/gamesPage/gameArchivePage/NewGameModal/NewGameModal.tsx";
import {Button} from "@/components/ui/button.tsx";
import PageContainer from "@/components/ui/pageContainer.tsx";
import {useGames} from "@/context/gamesContext.tsx";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/gamesPage/arcivedGames/TableColumns.tsx";
import {useMemo, useState} from "react";
import {RowSelectionState} from "@tanstack/react-table";
import RemoveGameModal from "@/pages/dashboardPage/gamesPage/gameArchivePage/removeGameModal.tsx";

export default function GameArchivePage() {
    const {games, remove: removeGames} = useGames();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [openRemoveModal, setOpenRemoveModal] = useState(false);

    const selectedIds = useMemo(() => {
        const indexes = Object.keys(rowSelection);
        return indexes.map(index => games[parseInt(index)].id);
    }, [rowSelection]);

    return (
        <PageContainer>
            <PageHeader>Games</PageHeader>
            <div className="space-y-10">
                <div className="flex gap-2.5">
                    <NewGameModal>
                        <Button variant="default">New Game</Button>
                    </NewGameModal>
                    {
                        selectedIds.length > 0 && (
                            <RemoveGameModal
                                open={openRemoveModal}
                                setOpen={setOpenRemoveModal}
                                onConfirmDelete={() => removeGames(selectedIds)}
                            >
                                <Button variant="outline">Delete</Button>
                            </RemoveGameModal>
                        )
                    }
                </div>
                <DataTable
                    columns={tableColumns}
                    data={games}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    filterByColumn={"title"}
                    filterText={"games"}
                />
            </div>
        </PageContainer>
    )
}