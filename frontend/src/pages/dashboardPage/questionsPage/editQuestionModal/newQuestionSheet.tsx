import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet.tsx";
import {EditQuestionForm} from "@/pages/dashboardPage/questionsPage/editQuestionModal/editQuestionForm.tsx";
import {Button} from "@/components/ui/button.tsx";
import {QuestionWithAnswer} from "@/Types.ts";
import {useState} from "react";
import {useQuestions} from "@/context/questionsContext.tsx";
import {useCategories} from "@/context/categoriesContext.tsx";

type QuestionSheetProps = {
    children: React.ReactNode;
}

export default function NewQuestionSheet({children}: QuestionSheetProps) {
    const [open, setOpen] = useState(false);
    const {add: addQuestion} = useQuestions();
    const {categories} = useCategories();

    const defaultValue = {
        id: "",
        title: "",
        answers: new Array(4).fill(""),
        correctAnswer: 0,
        category: "",
        categoryId: "",
        startTime: "",
        seconds: 30
    } as QuestionWithAnswer

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create a new question</SheetTitle>
                    <SheetDescription>
                        Add a new question to your collection. It can be added to a quiz later.
                    </SheetDescription>
                </SheetHeader>
                <EditQuestionForm
                    selectedQuestion={defaultValue}
                    categories={categories}
                    questionAction={addQuestion}
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