import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {QuestionWithAnswer} from "@/Types.ts";

type CurrentQuestionCardProps = {
    question: QuestionWithAnswer | null
}

export default function CurrentQuestionCard({question}: CurrentQuestionCardProps) {
    return (
        <Card className="bg-neutral-900">
            <CardHeader>Current Question</CardHeader>
            <CardContent>
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