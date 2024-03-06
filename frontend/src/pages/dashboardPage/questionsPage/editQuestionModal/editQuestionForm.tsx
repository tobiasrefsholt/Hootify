import {z} from "zod";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useQuestions} from "@/context/questionsContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MoreHorizontal} from "lucide-react";
import {useCategories} from "@/context/categoriesContext.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

const FormSchema = z.object({
    title: z.string().min(1),
    answers: z.array(
        z.object({
            answer: z.string().min(1)
        })
    ),
    correctAnswer: z.coerce.number().int().min(0),
    categoryId: z.string().uuid(),
})

type editQuestionFormProps = {
    questionId: string;
}

export function EditQuestionForm({questionId}: editQuestionFormProps) {
    const {categories} = useCategories();
    const {questions} = useQuestions();
    const selectedQuestion = questions.find(q => q.id === questionId);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: selectedQuestion?.title || "",
            answers: selectedQuestion?.answers.map(a => ({answer: a})) || [],
            correctAnswer: selectedQuestion?.correctAnswer || 0,
            categoryId: selectedQuestion?.categoryId || ""
        }
    })

    const answersArray = useFieldArray({
        control: form.control,
        name: "answers"
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-5">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Alternatives</FormLabel>
                    {answersArray.fields.map((field, index) => (
                        <div className="flex items-center gap-2.5" key={field.id}>
                            <FormField
                                control={form.control}
                                name={`answers.${index}.answer`}
                                render={({field}) => (
                                    <FormItem className="grow">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className={(form.watch("correctAnswer") === index)
                                                    ? "border-green-500"
                                                    : ""}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => form.setValue("correctAnswer", index)}
                                    >
                                        Set as correct
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            answersArray.remove(index)
                                        }}
                                    >
                                        Remove
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                    <Button
                        variant="ghost"
                        onClick={() => answersArray.append({answer: ""})}
                    >
                        Add alternative
                    </Button>
                </FormItem>
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category..."/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormItem className="flex justify-end">
                    <Button type="submit">Save changes</Button>
                </FormItem>
            </form>
        </Form>
    )
}