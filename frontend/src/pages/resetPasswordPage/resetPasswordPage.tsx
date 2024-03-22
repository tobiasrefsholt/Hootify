import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSearchParams} from "react-router-dom";
import {ApiEndpoint} from "@/Types.ts";
import {useState} from "react";
import {useNavigate} from "react-router";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

type PasswordResetErrorResponse = {
    type: string;
    title: string;
    status: number;
    errors: ErrorObject;
}

type ErrorObject = {
    InvalidToken: string[];
    PasswordTooShort?: string[];
    PasswordRequiresNonAlphanumeric?: string[];
    PasswordRequiresDigit?: string[];
    PasswordRequiresLower?: string[];
    PasswordRequiresUpper?: string[];
    PasswordRequiresUniqueChars?: string[];
}

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
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: searchParams.get("email") || "",
            code: searchParams.get("code") || "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    function showErrorResponse(errors: ErrorObject) {
        for (const key in errors) {
            if (key.includes("Password")) {
                const passwordErrors = errors[key as keyof ErrorObject];
                if (!passwordErrors) continue;
                form.setError("newPassword", {
                    message: passwordErrors[0]
                })
            } else if (key === "InvalidToken") {
                const invalidTokenErrors = errors[key as keyof ErrorObject];
                if (!invalidTokenErrors) continue;
                form.setError("root", {
                    message: invalidTokenErrors[0]
                })
            }
        }
    }

    async function onsubmit(data: z.infer<typeof FormSchema>) {
        setIsPending(true);
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + ApiEndpoint.ResetPassword, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: data.email,
                    resetCode: data.code,
                    newPassword: data.newPassword
                })
            });

            setIsPending(false);

            // Handle successful response
            if (response.status === 200) {
                toast("Password changed successfully");
                navigate("/");
                return;
            }

            if (response.status === 400) {
                const json = await response.json() as PasswordResetErrorResponse;
                showErrorResponse(json.errors);
                return;
            }

            // Handle error response
            if (!response.ok) throw new Error();

        } catch (e) {
            form.setError("root", {
                message: "Something went wrong. Please try again later."
            })
            setIsPending(false);
            return;
        }
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
                            {form.formState.errors.root?.message &&
                                <FormMessage>{form.formState.errors.root?.message}</FormMessage>}
                            <Button>{isPending ? <><Loader2/> Changing password</> : "Change password"}</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}