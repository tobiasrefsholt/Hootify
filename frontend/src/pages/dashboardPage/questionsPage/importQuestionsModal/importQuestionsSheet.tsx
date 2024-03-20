import {
    Sheet,
    SheetContent,
    SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.tsx"
import {ReactNode, useState} from "react";
import {useQuestions} from "@/context/questionsContext.tsx";
import {useCategories} from "@/context/categoriesContext.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import Papa, {ParseResult} from "papaparse";
import {InsertQuestion} from "@/Types.ts";
import {Link} from "react-router-dom";

type QuestionSheetProps = {
    children: ReactNode;
}

type QuestionRow = {
    question: string;
    answers: string;
    correctAnswer: string;
    category: string;
}

const formSchema = z.object({
    files: z.instanceof(FileList).refine(fileInput => {
        for (let i = 0; i < fileInput.length; ++i) {
            if (fileInput[i].type !== "text/csv") {
                return false;
            }
        }
        return true;
    }, {message: "Files must be of type .csv"})
});

export default function ImportQuestionsSheet({children}: QuestionSheetProps) {
    const [open, setOpen] = useState(false);
    const {addMultiple: addQuestions} = useQuestions();
    const {categories} = useCategories();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const fileRef = form.register("files");

    function onSubmit(data: z.infer<typeof formSchema>) {
        const file = data.files[0];
        Papa.parse(
            file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: handleCompleteParse
            }
        );
    }

    function handleCompleteParse(results: ParseResult<QuestionRow>) {
        console.log(results);
        results.meta.fields?.forEach((field) => {
            if (!["question", "answers", "correctAnswer", "category"].includes(field)) {
                throw new Error(`Invalid field ${field} in csv`);
            }
        });

        const questions = results.data
            // Filter out rows with invalid categories
            .filter(row =>
                categories.find(c => c.name.toLowerCase() === row.category.toLowerCase())
            )
            // Map to InsertQuestion type
            .map((row) => {
                const categoryId = categories.find(c => c.name === row.category)?.id;
                return {
                    title: row.question,
                    answers: row.answers
                        .split(";")
                        .map(a => a.trim())
                        .filter(a => a.length > 0),
                    correctAnswer: parseInt(row.correctAnswer),
                    categoryId
                } as InsertQuestion;
            });

        addQuestions(questions);
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Import questions from csv</SheetTitle>
                    <SheetDescription>
                        Upload a csv file with questions and answers to import them into your database.
                    </SheetDescription>
                </SheetHeader>
                <Button
                    variant="outline"
                    className="mt-5"
                >
                    <Link to="/QuestionImportSample.csv" target="_blank" download>Download sample file</Link>
                </Button>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-2.5">
                        <FormField
                            control={form.control}
                            name="files"
                            render={() => {
                                return (
                                    <FormItem>
                                        <FormLabel>File</FormLabel>
                                        <FormDescription>
                                            <p>Must contain exactly these columns:</p>
                                            <ul className="list-disc list-inside ml-5">
                                                <li><b>question</b></li>
                                                <li><b>answers</b> - separated by semicolon</li>
                                                <li><b>correctAnswer</b> - index of correct answer</li>
                                                <li><b>category</b> - name of the category. The question will be skipped if it does not exist</li>
                                            </ul>
                                        </FormDescription>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept=".csv"
                                                placeholder="Your .csv file" {...fileRef}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                );
                            }}
                        />
                        <Button type="submit">Import</Button>
                    </form>
                </Form>
                <SheetFooter className="mt-2.5">

                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}