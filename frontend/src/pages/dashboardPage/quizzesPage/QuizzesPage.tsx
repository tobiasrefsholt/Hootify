import PageContainer from "@/components/ui/pageContainer";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {useFetch} from "@/hooks/useFetch.ts";
import {ApiEndpoint, Quiz} from "@/Types.ts";
import {useEffect, useState} from "react";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/quizzesPage/quizzesTable/TableColumns.tsx";
import {RowSelectionState} from "@tanstack/react-table";

export default function QuizzesPage() {
    const quizzes = useFetch<Quiz[]>(ApiEndpoint.DashboardGetAllQuizzes, []);
    const [selectedQuizzes, setSelectedQuizzes] = useState<RowSelectionState>({});

    useEffect(() => {
        quizzes.doFetch("POST", [], {
            categoryId: "3fa85f64-5717-4562-b3fc-2c963f66afaf",
            search: ""
        });
    }, []);

    return (
        <PageContainer>
            <PageHeader>Quizzes</PageHeader>
            <DataTable
                columns={tableColumns}
                data={quizzes.data || []}
                rowSelection={selectedQuizzes}
                setRowSelection={setSelectedQuizzes}
            />
        </PageContainer>
    )
}