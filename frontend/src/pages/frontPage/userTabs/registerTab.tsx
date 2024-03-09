import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ApiEndpoint} from "@/Types.ts";
import {useState} from "react";
import {Loader2} from "lucide-react";

type RegisterErrorResponse = {
    type: string;
    title: string;
    status: number;
    errors: ErrorObject;
}

type ErrorObject = {
    InvalidEmail?: string[];
    DuplicateEmail?: string[];
    DuplicateUserName?: string[];
    PasswordTooShort?: string[];
    PasswordRequiresNonAlphanumeric?: string[];
    PasswordRequiresDigit?: string[];
    PasswordRequiresLower?: string[];
    PasswordRequiresUpper?: string[];
    PasswordRequiresUniqueChars?: string[];
}

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
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(true);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    function showErrorResponse(errors: ErrorObject) {
        for (const key in errors) {
            if (key.includes("Password")) {
                const passwordErrors = errors[key as keyof ErrorObject];
                if (!passwordErrors) continue;
                form.setError("password", {
                    message: passwordErrors[0]
                })
            }
            if (key.includes("Email") || key.includes("UserName")) {
                const emailErrors = errors[key as keyof ErrorObject];
                if (!emailErrors) continue;
                form.setError("email", {
                    message: emailErrors[0]
                })
            }
        }
    }

    async function onsubmit(data: z.infer<typeof FormSchema>) {
        setIsPending(true);
        setError(null);
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + ApiEndpoint.Register, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            setIsPending(false);
            const json = await response.json() as RegisterErrorResponse | true;
            // Handle successful response
            if (json === true) {
                setSuccess(true)
                return;
            }
            // Handle error response
            showErrorResponse(json.errors);
        } catch (e) {
            setError("Something went wrong. Please try again later.");
            setIsPending(false);
            return;
        }
    }

    // If registration was successful, show success message
    if (success) return (
        <>
            <h3 className="text-lg font-bold mt-5">Registration successful!</h3>
            <p>Please check your email to verify the account.</p>
        </>
    )

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
                {error && <FormMessage>{error}</FormMessage>}
                <Button variant="secondary">
                    {isPending ? <Loader2/> : "Register"}
                </Button>
            </form>
        </Form>
    )
}