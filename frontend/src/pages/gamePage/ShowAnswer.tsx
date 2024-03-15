import { QuestionWithAnswer } from "@/Types"
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";

type ShowAnswerProps = {
    question: QuestionWithAnswer | null
}

export function ShowAnswer({ question }: ShowAnswerProps) {
    if (!question) return <h1>No question</h1>
    return (
        <div className="container space-y-10">
            <h1 className="text-4xl md:text-6xl text-center font-bold">{question.title}</h1>
            <div className="grid md:grid-cols-2 grid-rows-2 gap-5">
                {question.answers.map((answer, index) => (
                    <Card key={question.id + "-" + index}
                          className={question.correctAnswer === index ? "bg-green-700" : "bg-accent/90"}>
                        <CardHeader className="text-muted-foreground">Alternative {index + 1}</CardHeader>
                        <CardContent className="text-2xl font-bold">
                            {answer}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}