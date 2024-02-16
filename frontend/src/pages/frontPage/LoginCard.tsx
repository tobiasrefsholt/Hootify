import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


export default function JoinGameCard() {
    return (
        <Card className="w-80">
            <form action="">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Access dashboard</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Input placeholder="Email" inputMode="numeric" />
                    <Input placeholder="Password" type="password" />
                </CardContent>
                <CardFooter className="mt-auto">
                    <Button variant="secondary">Login</Button>
                </CardFooter>
            </form>
        </Card>
    )
}