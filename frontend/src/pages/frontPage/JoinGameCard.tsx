import {ApiEndpoint, Player} from "@/Types";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import {useState} from "react";
import {useNavigate} from "react-router";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp.tsx";
import {REGEXP_ONLY_DIGITS} from "input-otp";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input.tsx";
import {Loader2} from "lucide-react";

const FormSchema = z.object({
    gamePin: z.string().length(6).regex(new RegExp(REGEXP_ONLY_DIGITS), "Game-pin must be numeric"),
    name: z.string().min(1)
});

export default function JoinGameCard() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            gamePin: "",
            name: ""
        }
    })

    async function joinGame(data: z.infer<typeof FormSchema>) {
        setIsPending(true);
        setError(null);
        try {
            const url = import.meta.env.VITE_BACKEND_URL + `${ApiEndpoint.JoinGame}/${data.gamePin}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: data.name})
            });

            setIsPending(false);

            if (!response.ok) throw new Error();

            const player = await response.json() as Player | null;
            console.log(player)

            if (!player) {
                form.setError("gamePin", {
                    type: "manual",
                    message: "Game-pin does not exist"
                })
                return;
            }

            navigate("/game/" + player.id);
        } catch (e) {
            setError("Something went wrong. Please try again later.");
            setIsPending(false);
            return;
        }
    }

    return (
        <Card className="w-full sm:w-80">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(joinGame)}>
                    <CardHeader>
                        <CardTitle>Join game</CardTitle>
                        <CardDescription>Enter the game pin and a username to join</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <FormField
                            control={form.control}
                            name="gamePin"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Game-pin</FormLabel>
                                    <FormControl>
                                        <InputOTP
                                            {...field}
                                            autoFocus={true}
                                            maxLength={6}
                                            render={({slots}) => (
                                                <InputOTPGroup>
                                                    {slots.map((slot, index) => (
                                                        <InputOTPSlot key={index} {...slot} />
                                                    ))}
                                                </InputOTPGroup>
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your display name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {error && <FormMessage>{error}</FormMessage>}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">{isPending ? <Loader2/> : "Join"}</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}