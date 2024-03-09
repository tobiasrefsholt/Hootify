import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const FormSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .refine((password) => /[A-Z]/.test(password), {
            message: "Password must contain at least one uppercase character",
        })
        .refine((password) => /[a-z]/.test(password), {
            message: "Password must contain at least one lowercase character",
        })
        .refine((password) => /[0-9]/.test(password), {
            message: "Password must contain at least one digit",
        })
        .refine((password) => /\W|_/.test(password), {
            message: "Password must contain at least one non-alphanumeric character",
        })
});

export default function RegisterTab() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    function onsubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-2.5">
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="mail@example.com" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••••••••••" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button variant="secondary">
                    Register
                </Button>
            </form>
        </Form>
    )
}