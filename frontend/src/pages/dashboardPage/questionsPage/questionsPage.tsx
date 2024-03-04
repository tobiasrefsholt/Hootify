import PageContainer from "@/components/ui/pageContainer";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/questionsPage/questionsTable/TableColumns.tsx";
import {useQuestions} from "@/context/questionsContext.tsx";

export default function QuestionsPage() {
    const {questions} = useQuestions();

    return (
        <PageContainer>
            <PageHeader>Questions</PageHeader>
            <DataTable columns={tableColumns} data={questions || []}/>
        </PageContainer>
    )
}