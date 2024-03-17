import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {InsertQuiz, Quiz} from "@/Types.ts";

const FormSchema = z.object({
    title: z.string().min(3),
    description: z.string(),
})

type newQuizFormProps = {
    selectedQuiz: InsertQuiz;
    quizAction: (question: Quiz) => void;
    afterSubmit?: () => void;
}

export function EditQuizForm({selectedQuiz, quizAction, afterSubmit}: newQuizFormProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: selectedQuiz.title,
            description: selectedQuiz.description,

        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
        quizAction({
            title: data.title,
            description: data.description,
            questionIds: selectedQuiz.questionIds
        } as Quiz);
        afterSubmit?.();
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
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
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