import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useUser} from "@/context/userContext.tsx";
import {useFetch} from "@/hooks/useFetch.ts";
import {ApiEndpoint} from "@/Types.ts";
import {useState} from "react";
import {Loader} from "lucide-react";
import CardGrid from "@/components/ui/cardGrid.tsx";

const FormSchema = z.object({
    newEmail: z.string().email()
});

export default function ProfilePage() {
    const {userData} = useUser();
    const {doFetch, isPending} = useFetch(ApiEndpoint.ManageInfo, [], null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            newEmail: userData?.email || ""
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
        doFetch("POST", [], data, (statusCode) => {
            if (statusCode === 200) {
                setSuccessMessage("Email is updated. Please check your email for confirmation.");
            } else {
                console.log("Email update failed");
            }
        });
    }

    return (
        <CardGrid>
            <Card>
                <CardHeader>Change your profile details</CardHeader>
                <CardContent>
                    {successMessage
                        ? <p>{successMessage}</p>
                        : <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="newEmail"
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
                                <FormMessage></FormMessage>
                                <Button type="submit" className="btn btn-primary mt-5">
                                    {isPending
                                        ? <><Loader/>Saving...</>
                                        : <>Save</>}
                                </Button>
                            </form>
                        </Form>}
                </CardContent>
            </Card>
        </CardGrid>
    )
}