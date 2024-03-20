import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

type GameCompleteProps = {
    sendLeaderboard: () => void;
}

export default function GameComplete({sendLeaderboard}: GameCompleteProps) {
    return (
        <Card>
            <CardHeader>Game is complete!</CardHeader>
            <CardContent>
                <Button variant="outline" onClick={sendLeaderboard}>Send leaderboard</Button>
            </CardContent>
        </Card>
    )
}