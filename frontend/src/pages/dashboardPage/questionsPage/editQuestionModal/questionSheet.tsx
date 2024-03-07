import {Button} from "@/components/ui/button.tsx";
import {
    Sheet,
    SheetContent,
    SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.tsx"
import {QuestionWithAnswer} from "@/Types.ts";
import {ReactNode, useState} from "react";
import RemoveQuestionModal from "@/pages/dashboardPage/questionsPage/removeQuestionModal.tsx";
import {EditQuestionForm} from "@/pages/dashboardPage/questionsPage/editQuestionModal/editQuestionForm.tsx";
import {useQuestions} from "@/context/questionsContext.tsx";
import {useCategories} from "@/context/categoriesContext.tsx";

type QuestionSheetProps = {
    question: QuestionWithAnswer;
    children: ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function QuestionSheet({question, children, open, setOpen}: QuestionSheetProps) {
    const [openRemoveModal, setOpenRemoveModal] = useState(false);
    const {edit: editQuestion, remove: removeQuestion} = useQuestions();
    const {categories} = useCategories();

    function handleDeleteQuestion() {
        removeQuestion(question.id);
        setOpen(false)
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit question</SheetTitle>
                    <SheetDescription>
                        Make changes to your question. All quizzes using this question will be updated.
                    </SheetDescription>
                </SheetHeader>
                <EditQuestionForm selectedQuestion={question} categories={categories} questionAction={editQuestion}
                                  afterSubmit={() => setOpen(false)}/>
                <SheetFooter className="mt-2.5">
                    <RemoveQuestionModal
                        open={openRemoveModal}
                        setOpen={setOpenRemoveModal}
                        onConfirmDelete={handleDeleteQuestion}
                    >
                        <Button
                            variant="ghost">
                            Remove question
                        </Button>
                    </RemoveQuestionModal>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}