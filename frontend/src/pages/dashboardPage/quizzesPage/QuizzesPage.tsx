import PageContainer from "@/components/ui/pageContainer";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {useState} from "react";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/quizzesPage/quizzesTable/TableColumns.tsx";
import {RowSelectionState} from "@tanstack/react-table";
import {useQuizzes} from "@/context/quizzesContext.tsx";

export default function QuizzesPage() {
    const {quizzes} = useQuizzes();
    const [selectedQuizzes, setSelectedQuizzes] = useState<RowSelectionState>({});

    return (
        <PageContainer>
            <PageHeader>Quizzes</PageHeader>
            <DataTable
                columns={tableColumns}
                data={quizzes || []}
                rowSelection={selectedQuizzes}
                setRowSelection={setSelectedQuizzes}
                filterByColumn={"title"}
                filterText={"quizzes"}
            />
        </PageContainer>
    )
}