import PageContainer from "@/components/ui/pageContainer";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/questionsPage/questionsTable/TableColumns.tsx";
import {useFetch} from "@/hooks/useFetch.ts";
import {ApiEndpoint, Question} from "@/Types.ts";
import {useEffect} from "react";

export default function QuestionsPage() {
    const questions = useFetch<Question[]>(ApiEndpoint.DashboardGetAllQuestions, []);

    useEffect(() => {
        questions.doFetch("POST", [], {
            categoryId: "3fa85f64-5717-4562-b3fc-2c963f66afaf",
            search: ""
        });
    }, []);

    return (
        <PageContainer>
            <PageHeader>Questions</PageHeader>
            <DataTable columns={tableColumns} data={questions.data || []}/>
        </PageContainer>
    )
}