import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


export default function JoinGameCard() {
    return (
        <Card className="w-80">
            <form action="">
                <CardHeader>
                    <CardTitle>Join game</CardTitle>
                    <CardDescription>Enter the game pin and a username to join</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Input placeholder="Game pin" inputMode="numeric" />
                    <Input placeholder="Username" />
                </CardContent>
                <CardFooter>
                    <Button>Join</Button>
                </CardFooter>
            </form>
        </Card>
    )
}