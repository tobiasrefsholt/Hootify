import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ApiEndpoint} from "@/Types.ts";
import {useState} from "react";
import {Loader} from "lucide-react";

type ChangePasswordErrorResponse = {
    type: string;
    title: string;
    status: number;
    errors: ErrorObject;
}

type ErrorObject = {
    PasswordMismatch?: string[];
    PasswordTooShort?: string[];
    PasswordRequiresNonAlphanumeric?: string[];
    PasswordRequiresDigit?: string[];
    PasswordRequiresLower?: string[];
    PasswordRequiresUpper?: string[];
    PasswordRequiresUniqueChars?: string[];
}

const FormSchema = z.object({
    oldPassword: z.string(),
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
});

export default function ChangePasswordCard() {
    const [success, setSuccess] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: ""
        }
    })

    function showErrorResponse(errors: ErrorObject) {
        for (const key in errors) {
            if (key === "PasswordMismatch") {
                const oldPasswordErrors = errors[key as keyof ErrorObject];
                if (!oldPasswordErrors) continue;
                form.setError("oldPassword", {
                    message: oldPasswordErrors[0]
                })
            } else {
                const newPasswordErrors = errors[key as keyof ErrorObject];
                if (!newPasswordErrors) continue;
                form.setError("newPassword", {
                    message: newPasswordErrors[0]
                })
            }
        }
    }

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + ApiEndpoint.ManageInfo, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            setIsPending(false);

            // Handle successful response
            if (response.status === 200) {
                setSuccess(true)
                return;
            }

            if (response.status === 400) {
                const json = await response.json() as ChangePasswordErrorResponse;
                showErrorResponse(json.errors);
                return;
            }

            // Handle error response
            if (!response.ok) throw new Error();

        } catch (e) {
            setError("Something went wrong. Please try again later.");
            setIsPending(false);
            return;
        }
    }

    return (
        <Card>
            <CardHeader>Change password</CardHeader>
            <CardContent>
                {success
                    ? <p>Password changed successfully!</p>
                    : <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Current password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••••••••••" {...field} />
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
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormMessage>{error}</FormMessage>
                        <Button>{isPending
                            ? <><Loader/>Changing password...</>
                            : <>Change password</>}</Button>
                    </form>
                </Form>}
            </CardContent>
        </Card>
    )
}