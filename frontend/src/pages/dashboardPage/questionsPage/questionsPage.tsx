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
import NewQuizSheet from "@/pages/dashboardPage/quizzesPage/quizzesArchive/newQuizModal/newQuizSheet.tsx";
import ImportQuestionsSheet from "@/pages/dashboardPage/questionsPage/importQuestionsModal/importQuestionsSheet.tsx";
import RemoveQuestionModal from "@/pages/dashboardPage/questionsPage/removeQuestionModal.tsx";
import {useNavigate} from "react-router";


export default function QuestionsPage() {
    const {questions, remove: removeQuestions} = useQuestions();
    const {quizzes, edit: editQuiz} = useQuizzes();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [OpenNewQuizModal, setOpenNewQuizModal] = useState(false);
    const [openRemoveModal, setOpenRemoveModal] = useState(false);
    const navigate = useNavigate();

    const selectedIds = useMemo(() => {
        const indexes = Object.keys(rowSelection);
        return indexes.map(index => questions[parseInt(index)].id);
    }, [rowSelection]);

    function handleAddToExistingQuiz(quizId: string) {
        const selectedQuiz = quizzes.find(quiz => quiz.id === quizId);
        if (!selectedQuiz) return;
        const newQuestionIds = selectedIds.filter(id => !selectedQuiz.questionIds.includes(id));
        editQuiz({...selectedQuiz, questionIds: [...selectedQuiz.questionIds, ...newQuestionIds]});
        setRowSelection({});
        navigate("/dashboard/quizzes/" + quizId);
    }

    return (
        <PageContainer>
            <PageHeader>Questions</PageHeader>
            <div className="mb-10 flex gap-2.5">
                <NewQuestionSheet>
                    <Button>Create new</Button>
                </NewQuestionSheet>
                <ImportQuestionsSheet>
                    <Button variant="secondary">Import from file</Button>
                </ImportQuestionsSheet>
                {selectedIds.length > 0 && (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Add to quiz</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setOpenNewQuizModal(true)}>
                                    Add to new quiz
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                {quizzes.map(quiz => (
                                    <DropdownMenuItem key={quiz.id} onClick={() => handleAddToExistingQuiz(quiz.id)}>
                                        {quiz.title}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <RemoveQuestionModal
                            open={openRemoveModal}
                            setOpen={setOpenRemoveModal}
                            onConfirmDelete={() => {
                                removeQuestions(selectedIds);
                                setRowSelection({});
                            }}
                        >
                            <Button variant="outline">Delete</Button>
                        </RemoveQuestionModal>
                        <Button variant="outline">Remove from all quizzes</Button>
                        <NewQuizSheet
                            open={OpenNewQuizModal}
                            setOpen={setOpenNewQuizModal}
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
                filterByColumn={"title"}
                filterText={"questions"}
            />
        </PageContainer>
    )
}