import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useUser} from "@/context/userContext.tsx";
import {useNavigate} from "react-router";
import {Loader2} from "lucide-react";
import {ApiEndpoint} from "@/Types.ts";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp.tsx";

type RegisterErrorResponse = {
    type: string;
    title: string;
    status: number;
    detail: string;
}

const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password cannot be empty"),
    twoFactorCode: z.string().optional()
});

export default function LoginTab() {
    const user = useUser();
    const navigate = useNavigate();

    const [isPending, setIsPending] = useState(false);
    const [useTwoFactor, setUseTwoFactor] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
            twoFactorCode: ""
        }
    })

    async function handleLogin(data: z.infer<typeof FormSchema>) {
        setIsPending(true);

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + ApiEndpoint.Login, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            setIsPending(false);

            // Handle successful response
            if (response.ok) {
                user.fetch();
                navigate("/dashboard");
                return;
            }

            // Handle error response
            const json: RegisterErrorResponse | null = await response.json();
            switch (json?.detail) {
                case "Failed":
                    form.setError(
                        "root",
                        useTwoFactor
                            ? {message: "Invalid one-time code"}
                            : {message: "Invalid email or password"}
                    )
                    break;
                case "RequiresTwoFactor":
                    useTwoFactor
                        ? form.setError("twoFactorCode", {message: "Two factor authentication required"})
                        : setUseTwoFactor(true);
                    break;
                default:
                    throw new Error();
            }

        } catch (e) {
            form.setError("root", {
                message: "Something went wrong. Please try again later."
            })
            setIsPending(false);
            return;
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-2.5">
                {useTwoFactor ?
                    <FormField
                        control={form.control}
                        name="twoFactorCode"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Enter one-time code</FormLabel>
                                <FormControl>
                                    <InputOTP
                                        {...field}
                                        autoFocus={true}
                                        maxLength={6}
                                        render={({slots}) => (
                                            <InputOTPGroup>
                                                {slots.map((slot, index) => (
                                                    <InputOTPSlot key={index} {...slot} />
                                                ))}{" "}
                                            </InputOTPGroup>
                                        )}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    : <>
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
                    </>}
                {form.formState.errors.root?.message &&
                    <FormMessage>{form.formState.errors.root?.message}</FormMessage>}
                <Button variant="secondary">
                    {isPending ? <Loader2/> : "Login"}
                </Button>
            </form>
        </Form>
    )
}