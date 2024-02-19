import { Player } from "@/Types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetch, ApiEndpoint } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


export default function JoinGameCard() {
    const { error, isPending, data: player, doFetch } = useFetch<Player>(ApiEndpoint.JoinGame, [], null);

    const [gamePin, setGamePin] = useState("");
    const [name, setName] = useState("");

    const navigate = useNavigate();

    function handleJoinGame(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        doFetch("POST", [gamePin], {
            name
        });
    }

    useEffect(() => {
        if (player?.id) {
            navigate("/game/" + player?.id);
        }
    }, [player?.id])

    return (
        <Card className="w-80">
            <form action="" onSubmit={handleJoinGame}>
                <CardHeader>
                    <CardTitle>Join game</CardTitle>
                    <CardDescription>Enter the game pin and a username to join</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Input placeholder="Game pin" inputMode="numeric" onChange={(e) => setGamePin(e.target.value)} />
                    <Input placeholder="Username" onChange={(e) => setName(e.target.value)} />
                    {error && <p className="text-red-500">{error}</p>}
                    {isPending && <p>Loading...</p>}
                </CardContent>
                <CardFooter>
                    <Button>Join</Button>
                </CardFooter>
            </form>
        </Card>
    )
}