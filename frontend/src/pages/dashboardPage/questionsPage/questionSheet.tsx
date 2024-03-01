import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Question} from "@/Types.ts";
import {Input} from "@/components/ui/input.tsx";
import {ReactNode, useState} from "react";
import {Textarea} from "@/components/ui/textarea.tsx";
import RemoveQuestionModal from "@/pages/dashboardPage/questionsPage/removeQuestionModal.tsx";

type QuestionSheetProps = {
    question: Question;
    children: ReactNode;
}

export default function questionSheet({question, children}: QuestionSheetProps) {
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
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Textarea id="title" defaultValue={question.title} className="col-span-3"/>
                    </div>
                    {question.answers.map((answer, i) => (
                        <div className="grid grid-cols-4 items-center gap-4" key={i}>
                            <Label htmlFor={`alt${i + 1}`} className="text-right">
                                Alternative {i + 1}
                            </Label>
                            <Input id={`alt${i + 1}`} defaultValue={answer} className="col-span-3"/>
                        </div>
                    ))}
                </div>
                <SheetFooter>
                    <RemoveQuestionModal onConfirm={() => setOpen(false)} onCanceled={() => {}}>
                        <Button variant="ghost">Remove question</Button>
                    </RemoveQuestionModal>
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}