import PageHeader from "@/components/ui/pageHeader.tsx";
import NewGameModal from "@/pages/dashboardPage/gamesPage/gameArchivePage/NewGameModal/NewGameModal.tsx";
import {Button} from "@/components/ui/button.tsx";
import PageContainer from "@/components/ui/pageContainer.tsx";
import {useGames} from "@/context/gamesContext.tsx";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/gamesPage/arcivedGames/TableColumns.tsx";
import {useState} from "react";
import {RowSelectionState} from "@tanstack/react-table";

export default function GameArchivePage() {
    const gamesContext = useGames();
    const [selectedGames, setSelectedGames] = useState<RowSelectionState>({});
    return (
        <PageContainer>
            <PageHeader>Games</PageHeader>
            <div className="space-y-10">
                <NewGameModal>
                    <Button variant="default">New Game</Button>
                </NewGameModal>
                <DataTable
                    columns={tableColumns}
                    data={gamesContext.games}
                    rowSelection={selectedGames}
                    setRowSelection={setSelectedGames}
                    filterByColumn={"title"}
                    filterText={"games"}
                />
            </div>
        </PageContainer>
    )
}