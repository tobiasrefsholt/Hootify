import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

type ShowLeaderBoardActionsProps = {
    sendAnswer: () => void;
    sendNextQuestion: () => void;
}
export default function ShowLeaderBoardActions({sendAnswer, sendNextQuestion}: ShowLeaderBoardActionsProps) {
    return (
        <Card>
            <CardHeader>Showing leaderboard</CardHeader>
            <CardContent>
                <div className="flex gap-2.5 flex-wrap">
                    <Button onClick={sendNextQuestion}>Next question</Button>
                    <Button variant="secondary" onClick={sendAnswer}>Send answer</Button>
                </div>
            </CardContent>
        </Card>
    )
}