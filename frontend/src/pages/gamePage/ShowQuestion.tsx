import {Question} from "@/Types"
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {useEffect, useState} from "react";
import {Progress} from "@/components/ui/progress.tsx";
import useShowQuestion from "@/pages/gamePage/useShowQuestion.ts";

type ShowQuestionProps = {
    question: Question | null,
    answerQuestion: (questionId: string, answer: number) => void
}

export default function ShowQuestion({question, answerQuestion}: ShowQuestionProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const {progressPercentage} = useShowQuestion({question});

    useEffect(() => {
        if (!question?.id) return;
        setSelectedAnswer(null);
    }, [question?.id]);

    function handleAnswerClick(answer: number) {
        if (selectedAnswer !== null || question === null) return;

        setSelectedAnswer(answer);
        answerQuestion(question.id, answer);
    }

    if (!question) return <h1>No question</h1>
    return (
        <div className="w-full xl:w-8/12 space-y-10">
            <h1 className="text-4xl md:text-6xl text-center font-bold">{question.title}</h1>
            {(progressPercentage === 100)
                ? <h1 className="text-center">Time's up!</h1>
                : <Progress value={progressPercentage}/>}
            <div className="grid md:grid-cols-2 grid-rows-2 gap-5">
                {question.answers.map((answer, index) => {
                    const isSelected = selectedAnswer === index;
                    return (
                        <Card key={index} onClick={() => handleAnswerClick(index)}
                              className={isSelected ? "bg-primary/90" : "cursor-pointer bg-accent/90 hover:bg-accent/60"}>
                            <CardHeader className="text-muted-foreground">Alternative {index + 1}</CardHeader>
                            <CardContent className="text-2xl font-bold">
                                {answer}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}