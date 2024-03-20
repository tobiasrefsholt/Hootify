import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {QuestionWithAnswer} from "@/Types.ts";
import Countdown, {CountdownTimeDelta, zeroPad} from "react-countdown";
import ShowQuestionWithAnswer
    from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/ShowQuestionWithAnswer.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useMemo} from "react";

type CurrentQuestionCardProps = {
    question: QuestionWithAnswer | null
    onComplete: () => void
    sendNextQuestion: () => void
    sendLeaderboard: () => void
}

export default function QuestionInProgressActions(
    {
        question,
        onComplete,
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
            onComplete();
        }
    }

    return (
        <Card className="bg-neutral-900">
            <CardHeader>Current Question</CardHeader>
            <CardContent>
                {endTimestamp &&
                    <div className="mb-5">
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
                <ShowQuestionWithAnswer question={question}/>
            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={sendLeaderboard}>Send leaderboard</Button>
                <Button variant="outline" onClick={sendNextQuestion}>Send next question</Button>
            </CardFooter>
        </Card>
    )
}