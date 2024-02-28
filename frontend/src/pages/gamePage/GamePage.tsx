import {useParams} from "react-router";
import {GameState} from "@/Types";
import ShowQuestion from "./ShowQuestion";
import WaitingForPlayers from "./WaitingForPlayers";
import {ShowAnswer} from "./ShowAnswer";
import ShowLeaderBoard from "@/pages/gamePage/ShowLeaderBoard.tsx";
import {usePlayerWebSocket} from "@/hooks/usePlayerWebSocket.ts";

export default function GamePage() {
    const {playerId} = useParams();
    const {
        gameState,
        question,
        questionWithAnswer,
        leaderBoard,
        getGameState,
        answerQuestion,
        sendChatMessage
    } = usePlayerWebSocket(playerId || "");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-10 px-10">
            {gameState === null && <h1 className="text-6xl text-center font-bold">Connecting to server...</h1>}
            {gameState === GameState.WaitingForPlayers &&
                <WaitingForPlayers
                    players={leaderBoard}
                    currentPlayerId={playerId || ""}
                    sendChatMessage={sendChatMessage}
                />}
            {gameState === GameState.QuestionInProgress &&
                <ShowQuestion
                    question={question}
                    answerQuestion={answerQuestion}
                    getGameState={getGameState}
                />}
            {gameState === GameState.ShowAnswer && <ShowAnswer question={questionWithAnswer}/>}
            {gameState === GameState.ShowLeaderboard && <ShowLeaderBoard leaderBoard={leaderBoard}/>}
            {gameState === GameState.GameComplete && <h1 className="text-6xl text-center font-bold">Game over!</h1>}
        </div>
    )
}