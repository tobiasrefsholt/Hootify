import PageContainer from "@/components/ui/pageContainer";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {useMemo, useState} from "react";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/quizzesPage/quizzesTable/TableColumns.tsx";
import {RowSelectionState} from "@tanstack/react-table";
import {useQuizzes} from "@/context/quizzesContext.tsx";
import RemoveQuizModal from "@/pages/dashboardPage/quizzesPage/removeQuizModal.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";

export default function QuizzesPage() {
    const {quizzes, remove: removeQuizzes} = useQuizzes();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const navigate = useNavigate();

    const selectedIds = useMemo(() => {
        const indexes = Object.keys(rowSelection);
        return indexes.map(index => quizzes[parseInt(index)].id);
    }, [rowSelection]);

    const [openRemoveModal, setOpenRemoveModal] = useState(false);

    return (
        <PageContainer>
            <PageHeader>Quizzes</PageHeader>
            <div className="flex gap-2.5 flex-wrap mb-10">
                <Button onClick={() => navigate("/dashboard/questions")}>Create new</Button>
                {
                    selectedIds.length > 0 && (
                        <RemoveQuizModal
                            open={openRemoveModal}
                            setOpen={setOpenRemoveModal}
                            onConfirmDelete={() => removeQuizzes(selectedIds)}
                        >
                            <Button variant="outline">Delete</Button>
                        </RemoveQuizModal>
                    )
                }
            </div>
            <DataTable
                columns={tableColumns}
                data={quizzes || []}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                filterByColumn={"title"}
                filterText={"quizzes"}
            />
        </PageContainer>
    )
}