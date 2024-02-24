import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useUser} from "@/context/userContext.tsx";
import {useNavigate} from "react-router";


export default function JoinGameCard() {
    const user = useUser();
    const navigate = useNavigate();
    return (
        <Card className="w-80 flex-col">
            {!user.userData?.id ?
                <>
                    <CardHeader>
                        <CardTitle>Welcome back, {user.userData?.name}</CardTitle>
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
                <form action="">
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Access dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Input placeholder="Email" inputMode="numeric"/>
                        <Input placeholder="Password" type="password"/>
                    </CardContent>
                    <CardFooter className="mt-auto">
                        <Button variant="secondary">Login</Button>
                    </CardFooter>
                </form>
            }
        </Card>
    )
}