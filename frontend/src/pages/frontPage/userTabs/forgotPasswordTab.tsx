import {useFetch} from "@/hooks/useFetch.ts";
import {ApiEndpoint} from "@/Types.ts";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "lucide-react";

const FormSchema = z.object({
    email: z.string().email()
});

export default function ForgotPasswordTab() {
    const {isPending, doFetch, responseCode} = useFetch(ApiEndpoint.ForgotPassword, []);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        doFetch("POST", [], data);
    }

    if (responseCode === 200)
        return (
            <p>An email has been sent to the provided address with instructions on how to reset your password.</p>
        )

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
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
                {form.formState.errors.root?.message &&
                    <FormMessage>{form.formState.errors.root?.message}</FormMessage>}
                <Button variant="secondary">
                    {isPending
                        ? <><Loader/> Resetting password</>
                        : "Reset password"}
                </Button>
            </form>
        </Form>
    )
}