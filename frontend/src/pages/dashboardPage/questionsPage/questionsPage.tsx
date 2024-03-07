import PageContainer from "@/components/ui/pageContainer";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/questionsPage/questionsTable/TableColumns.tsx";
import {useQuestions} from "@/context/questionsContext.tsx";
import {useEffect, useState} from "react";
import {RowSelectionState} from "@tanstack/react-table";
import NewQuestionSheet from "@/pages/dashboardPage/questionsPage/editQuestionModal/newQuestionSheet.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function QuestionsPage() {
    const questionsContext = useQuestions();
    const [selectedQuestions, setSelectedQuestions] = useState<RowSelectionState>({});

    useEffect(() => {
        console.log(selectedQuestions);
    }, [selectedQuestions]);

    return (
        <PageContainer>
            <PageHeader>Questions</PageHeader>
            <div className="mb-10">
                <NewQuestionSheet>
                    <Button>Create new</Button>
                </NewQuestionSheet>
            </div>
            <DataTable
                columns={tableColumns}
                data={questionsContext.questions || []}
                rowSelection={selectedQuestions}
                setRowSelection={setSelectedQuestions}
            />
        </PageContainer>
    )
}