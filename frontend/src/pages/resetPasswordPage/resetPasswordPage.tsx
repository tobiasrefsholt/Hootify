import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSearchParams} from "react-router-dom";

const FormSchema = z.object({
    email: z.string().email(),
    code: z.string(),
    newPassword: z.string()
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
        }),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: searchParams.get("email") || "",
            code: searchParams.get("code") || "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    function onsubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
    }

    return (
        <div className="h-screen overflow-y-auto">
            <div className="container py-10 min-h-full flex flex-col justify-center items-center gap-16">
                <h1 className="text-6xl font-bold">Reset password</h1>
                <div className="w-full flex flex-col sm:flex-row justify-center gap-5">
                    <Form {...form}>
                        <form className="space-y-2.5 rounded-lg border p-6 w-full sm:w-80"
                              onSubmit={form.handleSubmit(onsubmit)}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled
                                                type="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button>Change password</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}