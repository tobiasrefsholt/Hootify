import { QuestionWithAnswer } from "@/Types"
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";

type ShowAnswerProps = {
    question: QuestionWithAnswer | null
}

export function ShowAnswer({ question }: ShowAnswerProps) {
    if (!question) return <h1>No question</h1>
    return (
        <>
            <h1 className="text-4xl md:text-6xl text-center font-bold w-full xl:w-8/12">{question.title}</h1>
            <div className="grid md:grid-cols-2 grid-rows-2 gap-5 w-full xl:w-8/12">
                {question.answers.map((answer, index) => (
                    <Card key={question.id + "-" + index}
                          className={question.correctAnswer === index ? "bg-green-700" : "bg-accent/90"}>
                        <CardHeader className="text-muted-foreground">Alternative {index + 1}</CardHeader>
                        <CardContent className="text-lg text-2xl font-bold">
                            {answer}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}