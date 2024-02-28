import {QuestionWithAnswer} from "@/Types.ts";

type QuestionWithAnswerProps = {
    question: QuestionWithAnswer | null;
}

export default function ShowQuestionWithAnswer({question}: QuestionWithAnswerProps) {
    return (
        <>
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
        </>
    )
}