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
        <div className="h-screen overflow-y-auto">
            <div className="min-h-full flex flex-col justify-center py-20">
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
        </div>
    )
}