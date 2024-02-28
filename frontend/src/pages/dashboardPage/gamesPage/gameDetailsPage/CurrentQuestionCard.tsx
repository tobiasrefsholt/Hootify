import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Question} from "@/Types.ts";

type CurrentQuestionCardProps = {
    question: Question | null
}

export default function CurrentQuestionCard({question}: CurrentQuestionCardProps) {
    return (
        <Card className="bg-neutral-900">
            <CardHeader>Current Question</CardHeader>
            <CardContent>
                <p>Question:</p>
                <p className="mb-5 font-bold">{question?.title}</p>
            </CardContent>
        </Card>
    )
}