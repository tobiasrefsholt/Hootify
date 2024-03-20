import {GameState, QuestionWithAnswer} from "@/Types.ts";
import WaitingForPlayersActions
    from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/WaitingForPlayersActions.tsx";
import QuestionInProgressActions
    from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/QuestionInProgressActions.tsx";
import ShowLeaderBoardActions
    from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/ShowLeaderBoardActions.tsx";
import GameComplete from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/GameComplete.tsx";
import ShowAnswerActions from "@/pages/dashboardPage/gamesPage/gameDetailsPage/activeStateCards/ShowAnswerActions.tsx";

type ActiveStateActionsProps = {
    gameState: GameState | null;
    questionWithAnswer: QuestionWithAnswer | null;
    sendNextQuestion: () => void;
    sendLeaderboard: () => void;
    sendAnswer: () => void;
}
export default function ActiveStateActions(
    {
        gameState,
        questionWithAnswer,
        sendAnswer,
        sendNextQuestion,
        sendLeaderboard
    }: ActiveStateActionsProps) {
    return (
        <>
            {gameState === GameState.WaitingForPlayers &&
                <WaitingForPlayersActions
                    sendNextQuestion={sendNextQuestion}
                />}
            {gameState === GameState.QuestionInProgress &&
                <QuestionInProgressActions
                    question={questionWithAnswer}
                    sendAnswer={sendAnswer}
                    sendNextQuestion={sendNextQuestion}
                    sendLeaderboard={sendLeaderboard}
                />}
            {gameState === GameState.ShowAnswer &&
                <ShowAnswerActions
                    question={questionWithAnswer}
                    sendNextQuestion={sendNextQuestion}
                    sendLeaderboard={sendLeaderboard}
                />}
            {gameState === GameState.ShowLeaderboard &&
                <ShowLeaderBoardActions
                    sendAnswer={sendAnswer}
                    sendNextQuestion={sendNextQuestion}
                />}
            {gameState === GameState.GameComplete &&
                <GameComplete
                    sendLeaderboard={sendLeaderboard}
                />}
        </>
    )
}