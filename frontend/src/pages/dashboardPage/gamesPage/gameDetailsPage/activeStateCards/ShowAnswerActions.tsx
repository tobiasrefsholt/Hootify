import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import ShowQuestionWithAnswer
    from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/ShowQuestionWithAnswer.tsx";
import {QuestionWithAnswer} from "@/Types.ts";
import {Button} from "@/components/ui/button.tsx";

type ShowAnswerActionsProps = {
    question: QuestionWithAnswer | null
    sendNextQuestion: () => void
    sendLeaderboard: () => void
}

export default function ShowAnswerActions({question, sendNextQuestion, sendLeaderboard}: ShowAnswerActionsProps) {
    return (
        <Card>
            <CardHeader>Showing answer</CardHeader>
            <CardContent>
                <ShowQuestionWithAnswer question={question}/>
            </CardContent>
            <CardFooter className="flex gap-2.5 flex-wrap">
                <Button onClick={sendLeaderboard}>Send leaderboard</Button>
                <Button variant="secondary" onClick={sendNextQuestion}>Send next question</Button>
            </CardFooter>
        </Card>
    )
}