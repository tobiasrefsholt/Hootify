import PageContainer from "@/components/ui/pageContainer";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/questionsPage/questionsTable/TableColumns.tsx";
import {useQuestions} from "@/context/questionsContext.tsx";
import {useEffect, useState} from "react";
import {RowSelectionState} from "@tanstack/react-table";

export default function QuestionsPage() {
    const {questions} = useQuestions();
    const [selectedQuestions, setSelectedQuestions] = useState<RowSelectionState>({});

    useEffect(() => {
        console.log(selectedQuestions);
    }, [selectedQuestions]);

    return (
        <PageContainer>
            <PageHeader>Questions</PageHeader>
            <DataTable columns={tableColumns} data={questions || []} rowSelection={selectedQuestions} setRowSelection={setSelectedQuestions}/>
        </PageContainer>
    )
}