import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {QuestionWithAnswer} from "@/Types.ts";
import Countdown, {zeroPad} from "react-countdown";

type CurrentQuestionCardProps = {
    question: QuestionWithAnswer | null
    onComplete: () => void
}

export default function CurrentQuestionCard({question, onComplete}: CurrentQuestionCardProps) {
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
                <p>Question:</p>
                <p className="mb-5 font-bold">{question?.title}</p>
                <p>Alternatives:</p>
                <ul className="ml-5">
                    {question?.answers.map((answer, i) => {
                        const className = question?.correctAnswer === i
                            ? "font-bold list-decimal text-green-700"
                            : "list-decimal";
                        return (
                            <li key={question?.id + "_answer" + i} className={className}>{answer}</li>
                        )
                    })}
                </ul>
            </CardContent>
        </Card>
    )
}