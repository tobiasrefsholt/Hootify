import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

type ShowLeaderBoardActionsProps = {
    sendNextQuestion: () => void;
}
export default function ShowLeaderBoardActions({sendNextQuestion}: ShowLeaderBoardActionsProps) {
    return (
        <Card>
            <CardHeader>Showing leaderboard</CardHeader>
            <CardContent></CardContent>
            <CardFooter>
                <Button onClick={sendNextQuestion}>Next question</Button>
            </CardFooter>
        </Card>
    )
}