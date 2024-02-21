import {Question} from "@/Types"
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {useEffect, useState} from "react";

type ShowQuestionProps = {
    question: Question | null,
    answerQuestion: (questionId: string, answer: number) => void
}

export default function ShowQuestion({question, answerQuestion}: ShowQuestionProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    useEffect(() => {
        setSelectedAnswer(null);
    }, [question?.id]);

    function handleAnswerClick(answer: number) {
        if (selectedAnswer !== null || question === null) return;

        setSelectedAnswer(answer);
        answerQuestion(question.id, answer);
    }

    if (!question) return <h1>No question</h1>
    return (
        <>
            <h1 className="text-4xl md:text-6xl text-center font-bold w-full xl:w-8/12">{question.title}</h1>
            <div className="grid md:grid-cols-2 grid-rows-2 gap-5 w-full xl:w-8/12">
                {question.answers.map((answer, index) => {
                    const isSelected = selectedAnswer === index;
                    return (
                        <Card key={index} onClick={() => handleAnswerClick(index)}
                              className={isSelected ? "bg-primary/90" : "cursor-pointer bg-accent/90 hover:bg-accent/60"}>
                            <CardHeader className="text-muted-foreground">Alternative {index + 1}</CardHeader>
                            <CardContent className="text-lg text-2xl font-bold">
                                {answer}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </>
    )
}