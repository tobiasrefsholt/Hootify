import {Player} from "@/Types"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import React, {useState} from "react"

type WaitingForPlayersProps = {
    players: Player[]
    currentPlayerId: string
    sendChatMessage: (message: string, sender: string) => void
}

export default function WaitingForPlayers({players, currentPlayerId, sendChatMessage}: WaitingForPlayersProps) {
    const currentPlayer = players.find(player => player.id === currentPlayerId);
    const [message, setMessage] = useState("");

    function handleGreet(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        sendChatMessage(message, currentPlayer?.name || "");
        setMessage("");
    }

    return (
        <div className="container space-y-10">
            <h1 className="text-6xl text-center font-bold">Waiting for players</h1>
            <div className="max-w-sm space-y-5 mx-auto">
                <form className="flex gap-5 max-w-sm" onSubmit={(e) => handleGreet(e)}>
                    <Input type="text" placeholder="Say something" value={message}
                           onChange={(e) => setMessage(e.target.value)}/>
                    <Button>Send!</Button>
                </form>
                <Card>
                    <CardHeader className="text-lg font-bold text-center">{players.length} players have joined</CardHeader>
                    <CardContent>
                        <ul>
                            {players.map(player => (
                                <li key={player.id} className="text-center">{player.name}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}