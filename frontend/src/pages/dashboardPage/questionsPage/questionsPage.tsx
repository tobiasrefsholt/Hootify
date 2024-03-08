import PageContainer from "@/components/ui/pageContainer";
import PageHeader from "@/components/ui/pageHeader.tsx";
import {DataTable} from "@/components/ui/dataTable/DataTable.tsx";
import {tableColumns} from "@/pages/dashboardPage/questionsPage/questionsTable/TableColumns.tsx";
import {useQuestions} from "@/context/questionsContext.tsx";
import {useMemo, useState} from "react";
import {RowSelectionState} from "@tanstack/react-table";
import NewQuestionSheet from "@/pages/dashboardPage/questionsPage/editQuestionModal/newQuestionSheet.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useQuizzes} from "@/context/quizzesContext.tsx";
import NewQuizSheet from "@/pages/dashboardPage/quizzesPage/newQuizModal/newQuizSheet.tsx";

export default function QuestionsPage() {
    const {questions} = useQuestions();
    const {quizzes} = useQuizzes();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [newQuestionIsOpen, setnewQuestionIsOpen] = useState(false);

    const selectedIds = useMemo(() => {
        const indexes = Object.keys(rowSelection);
        return indexes.map(index => questions[parseInt(index)].id);
    }, [rowSelection]);

    return (
        <PageContainer>
            <PageHeader>Questions</PageHeader>
            <div className="mb-10 flex gap-2.5">
                <NewQuestionSheet>
                    <Button>Create new</Button>
                </NewQuestionSheet>
                <Button variant="outline">Import from file</Button>
                {selectedIds.length > 0 && (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Add to quiz</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setnewQuestionIsOpen(true)}>
                                    Add to new quiz
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                {quizzes.map(quiz => (
                                    <DropdownMenuItem key={quiz.id}>
                                        {quiz.title}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline">Delete</Button>
                        <Button variant="outline">Remove from all quizzes</Button>
                        <NewQuizSheet
                            open={newQuestionIsOpen}
                            setOpen={setnewQuestionIsOpen}
                            questionIds={selectedIds}
                            children=""
                        />
                    </>
                )}
            </div>
            <DataTable
                columns={tableColumns}
                data={questions || []}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
            />
        </PageContainer>
    )
}