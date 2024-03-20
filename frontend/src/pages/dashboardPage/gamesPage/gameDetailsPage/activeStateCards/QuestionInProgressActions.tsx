import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {QuestionWithAnswer} from "@/Types.ts";
import Countdown, {CountdownTimeDelta, zeroPad} from "react-countdown";
import ShowQuestionWithAnswer
    from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/ShowQuestionWithAnswer.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useMemo} from "react";

type CurrentQuestionCardProps = {
    question: QuestionWithAnswer | null
    sendAnswer: () => void
    sendNextQuestion: () => void
    sendLeaderboard: () => void
}

export default function QuestionInProgressActions(
    {
        question,
        sendAnswer,
        sendNextQuestion,
        sendLeaderboard
    }: CurrentQuestionCardProps) {

    const endTimestamp = useMemo(
        () => {
            if (!question?.seconds || !question.startTime) return null;
            return new Date(question.startTime).getTime() + question.seconds * 1000;
        },
        [question?.seconds, question?.id]
    );

    function handleOutOfTime(_timeDelta: CountdownTimeDelta, completedOnStart: boolean) {
        if (!completedOnStart) {
            sendAnswer();
        }
    }

    return (
        <Card className="bg-neutral-900">
            <CardHeader>Current Question</CardHeader>
            <CardContent className="space-y-5">
                {endTimestamp &&
                    <div>
                        <p>Time left:</p>
                        <Countdown
                            key={endTimestamp.toString()}
                            date={endTimestamp}
                            renderer={({minutes, seconds}) => (
                                <span>{zeroPad(minutes)}:{zeroPad(seconds)}</span>
                            )}
                            className="font-bold"
                            onComplete={(timeDelta, completedOnStart) => handleOutOfTime(timeDelta, completedOnStart)}
                        />
                    </div>}
                <div>
                    <ShowQuestionWithAnswer question={question}/>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                    <Button variant="secondary" onClick={sendAnswer}>Send answer</Button>
                    <Button variant="secondary" onClick={sendLeaderboard}>Send leaderboard</Button>
                    <Button variant="secondary" onClick={sendNextQuestion}>Send next question</Button>
                </div>
            </CardContent>
        </Card>
    )
}