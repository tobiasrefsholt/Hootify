import { QuestionWithAnswer } from "@/Types"

type ShowAnswerProps = {
    question: QuestionWithAnswer | null
}

export function ShowAnswer({ question }: ShowAnswerProps) {
    if (!question) return <h1>No question</h1>
    return (
        <>
            <h1 className="text-6xl text-center font-bold">{question.title}</h1>
            <div className="grid grid-cols-2 grid-rows-2">
                {question.answers.map((answer, index) => (
                    <div key={index}>
                        {answer}
                    </div>
                ))}
            </div>
        </>
    )
}