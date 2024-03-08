import {FormEvent, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useUser} from "@/context/userContext.tsx";
import {useNavigate} from "react-router";
import {Loader2} from "lucide-react";
import {ApiEndpoint} from "@/Types.ts";

export default function LoginTab() {
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

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + ApiEndpoint.Login, {
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
        <>
            <form onSubmit={handleLogin} className="space-y-2.5">
                <Input placeholder="Email" inputMode="numeric" ref={emailRef}/>
                <Input placeholder="Password" type="password" ref={passwordRef}/>
                {error && <p>{error}</p>}
                <div className="space-x-2.5">
                    <Button variant="secondary">
                        {isPending
                            ? <><Loader2/> Logging in</>
                            : "Login"}
                    </Button>
                    <Button variant="ghost">Forgot password</Button>
                </div>
            </form>
        </>
    )
}