import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

type WaitingForPlayersActionsProps = {
    sendNextQuestion: () => void;
}

export default function WaitingForPlayersActions({sendNextQuestion}: WaitingForPlayersActionsProps) {
    return (
        <Card>
            <CardHeader>Waiting for players</CardHeader>
            <CardContent>
                <Button variant="default" onClick={sendNextQuestion}>Start game</Button>
            </CardContent>
        </Card>
    )
}