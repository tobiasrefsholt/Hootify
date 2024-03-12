import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Category} from "@/Types.ts";
import {useCategories} from "@/context/categoriesContext.tsx";

const FormSchema = z.object({
    name: z.string().min(1),
})

export function NewCategoryForm() {
    const {add: addCategory} = useCategories();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        addCategory(data as Category);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit">Create category</Button>
            </form>
        </Form>
    )
}