import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {QuestionWithAnswer} from "@/Types.ts";
import Countdown, {zeroPad} from "react-countdown";
import ShowQuestionWithAnswer
    from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/ShowQuestionWithAnswer.tsx";

type CurrentQuestionCardProps = {
    question: QuestionWithAnswer | null
    onComplete: () => void
}

export default function QuestionInProgressActions({question, onComplete}: CurrentQuestionCardProps) {
    const startDate = new Date(question?.startTime || "");
    const endDate = new Date(startDate.getTime() + (question?.seconds || 0) * 1000);
    return (
        <Card className="bg-neutral-900">
            <CardHeader>Current Question</CardHeader>
            <CardContent>
                {question?.startTime &&
                    <div className="mb-5">
                        <p>Time left:</p>
                        <Countdown
                            autoStart={true}
                            date={endDate}
                            renderer={({minutes, seconds}) => (
                                <span>{zeroPad(minutes)}:{zeroPad(seconds)}</span>
                            )}
                            className="font-bold"
                            onComplete={onComplete}
                        />
                    </div>}
                <ShowQuestionWithAnswer question={question}/>
            </CardContent>
        </Card>
    )
}