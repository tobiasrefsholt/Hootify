import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import ShowQuestionWithAnswer
    from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/ShowQuestionWithAnswer.tsx";
import {QuestionWithAnswer} from "@/Types.ts";

type ShowAnswerActionsProps = {
    question: QuestionWithAnswer | null
}

export default function ShowAnswerActions({question}: ShowAnswerActionsProps) {
    return (
        <Card>
            <CardHeader>Showing answer</CardHeader>
            <CardContent>
                <ShowQuestionWithAnswer question={question}/>
            </CardContent>
        </Card>
    )
}