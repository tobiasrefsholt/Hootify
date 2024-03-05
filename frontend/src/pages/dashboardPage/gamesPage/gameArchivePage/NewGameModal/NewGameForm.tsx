import {useQuizzes} from "@/context/quizzesContext.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";

const FormSchema = z.object({
    name: z.string().min(1),
    quizId: z.string().uuid(),
    seconds: z.coerce.number().positive().min(2),
    randomizeQuestions: z.boolean(),
    randomizeAnswers: z.boolean(),
})

export function NewGameForm() {
    /*const {add: addGame} = useGames();*/
    const {quizzes} = useQuizzes();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            quizId: "",
            seconds: 30,
            randomizeQuestions: false,
            randomizeAnswers: false
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quizId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Select a quiz</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a quiz"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {quizzes.map((quiz) => (
                                            <SelectItem key={quiz.id} value={quiz.id}>{quiz.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="seconds"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Seconds per question</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="randomizeQuestions"
                    render={({field}) => (
                        <FormItem className="flex flex-row items-start gap-2.5 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel className="mt-0">
                                Randomize order of questions
                            </FormLabel>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="randomizeAnswers"
                    render={({field}) => (
                        <FormItem className="flex flex-row items-start gap-2.5 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel className="mt-0">
                                Randomize order of answers
                            </FormLabel>
                        </FormItem>
                    )}
                />
                <Button type="submit">Create game</Button>
            </form>
        </Form>
    )
}