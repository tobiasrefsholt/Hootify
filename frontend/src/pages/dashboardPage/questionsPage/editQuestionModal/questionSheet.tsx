import {Button} from "@/components/ui/button.tsx";
import {
    Sheet,
    SheetContent,
    SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.tsx"
import {Question} from "@/Types.ts";
import {ReactNode, useState} from "react";
import RemoveQuestionModal from "@/pages/dashboardPage/questionsPage/removeQuestionModal.tsx";
import {EditQuestionForm} from "@/pages/dashboardPage/questionsPage/editQuestionModal/editQuestionForm.tsx";

type QuestionSheetProps = {
    question: Question;
    children: ReactNode;
}

export default function QuestionSheet({question, children}: QuestionSheetProps) {
    const [open, setOpen] = useState(false);
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
                <EditQuestionForm questionId={question.id}/>
                <SheetFooter className="mt-2.5">
                    <RemoveQuestionModal onConfirm={() => setOpen(false)} onCanceled={() => {
                    }}>
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