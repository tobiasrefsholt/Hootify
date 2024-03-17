import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Quiz} from "@/Types.ts";
import {useQuizzes} from "@/context/quizzesContext.tsx";
import {EditQuizForm} from "@/pages/dashboardPage/quizzesPage/quizzesArchive/newQuizModal/editQuizForm.tsx";
import {ReactNode} from "react";

type QuestionSheetProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: ReactNode;
    questionIds: string[];
}

export default function NewQuizSheet({open, setOpen, children, questionIds}: QuestionSheetProps) {
    const {add: addQuiz} = useQuizzes();

    const defaultValue = {
        id: "",
        title: "",
        description: "string",
        questionIds: questionIds,
    } as Quiz

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create a new quiz</SheetTitle>
                    <SheetDescription>
                        Create a quiz from the selected questions
                    </SheetDescription>
                </SheetHeader>
                <EditQuizForm
                    selectedQuiz={defaultValue}
                    quizAction={addQuiz}
                    afterSubmit={() => setOpen(false)}
                />
                <SheetFooter>
                    <SheetClose>
                        <Button
                            variant="ghost">
                            Cancel
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}