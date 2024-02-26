import {FormEvent, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useUser} from "@/context/userContext.tsx";
import {useNavigate} from "react-router";
import {Loader2} from "lucide-react";

export default function JoinGameCard() {
    const user = useUser();
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsPending(true);
        setError(null);
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        if (!email && !password) return;

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/login?useCookies=true", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        });

        setIsPending(false);

        if (!response.ok) {
            setError("Login failed, please try again.");
            return;
        }

        user.login({email: email!});
        navigate("/dashboard");
    }

    return (
        <Card className="w-80 flex-col">
            {user.userData?.email ?
                <>
                    <CardHeader>
                        <CardTitle>Welcome back, {user.userData?.email}</CardTitle>
                        <CardDescription>Access dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="grow">
                        <p>You are logged in</p>
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                            Open dashboard
                        </Button>
                        <Button variant="outline" onClick={user.logout}>Logout</Button>
                    </CardFooter>
                </>
                :
                <form onSubmit={handleLogin}>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Access dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Input placeholder="Email" inputMode="numeric" ref={emailRef}/>
                        <Input placeholder="Password" type="password" ref={passwordRef}/>
                    </CardContent>
                    <CardFooter className="mt-auto flex-col items-start gap-2.5">
                        {error && <p>{error}</p>}
                        <Button variant="secondary">
                            {isPending
                                ? <><Loader2/> Logging in</>
                                : "Login"}
                        </Button>
                    </CardFooter>
                </form>
            }
        </Card>
    )
}