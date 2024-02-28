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
    sendAnswer: () => void;
}
export default function ActiveStateActions({gameState, questionWithAnswer, sendAnswer}: ActiveStateActionsProps) {
    return (
        <>
            {gameState === GameState.WaitingForPlayers &&
                <WaitingForPlayersActions/>}
            {gameState === GameState.QuestionInProgress &&
                <QuestionInProgressActions question={questionWithAnswer} onComplete={sendAnswer}/>}
            {gameState === GameState.ShowAnswer &&
                <ShowAnswerActions question={questionWithAnswer}/>}
            {gameState === GameState.ShowLeaderboard &&
                <ShowLeaderBoardActions/>}
            {gameState === GameState.GameComplete &&
                <GameComplete/>}
        </>
    )
}