import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useUser} from "@/context/userContext.tsx";
import {useNavigate} from "react-router";
import {Loader2} from "lucide-react";
import {ApiEndpoint} from "@/Types.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password cannot be empty")
});

export default function LoginTab() {
    const user = useUser();
    const navigate = useNavigate();

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function handleLogin(data: z.infer<typeof FormSchema>) {
        setIsPending(true);
        setError(null);

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
            if (response.status === 401) {
                setError("Wrong username or password.");
                return;
            }
            if (response.status !== 200) {
                throw new Error();
            }
        } catch (e) {
            setError("Something went wrong. Please try again later.");
            setIsPending(false);
            return;
        }

        setIsPending(false);
        user.fetch();
        navigate("/dashboard");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-2.5">
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
                    {isPending ? <Loader2/> : "Login"}
                </Button>
            </form>
        </Form>
    )
}