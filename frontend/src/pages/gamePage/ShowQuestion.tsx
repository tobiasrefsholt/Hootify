import { Question } from "@/Types"

type ShowQuesionProps = {
    question: Question | null,
    answerQuestion: (answer: number) => void
}

export default function ShowQuestion({ question, answerQuestion }: ShowQuesionProps) {
    if (!question) return <h1>No question</h1>
    return (
        <>
            <h1 className="text-6xl text-center font-bold">{question.title}</h1>
            <div className="grid grid-cols-2 grid-rows-2">
                {question.answers.map((answer, index) => (
                    <button key={index} onClick={() => answerQuestion(index + 1)}>{answer}</button>
                ))}
            </div>
        </>
    )
}