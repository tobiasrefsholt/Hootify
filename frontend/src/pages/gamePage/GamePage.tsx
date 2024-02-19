import { useParams } from "react-router";
import { useWebSocket } from "../../hooks/useWebSocket";
import { GameState } from "@/Types";
import ShowQuestion from "./ShowQuestion";
import WaitingForPlayers from "./WaitingForPlayers";
import { ShowAnswer } from "./ShowAnswer";

export default function GamePage() {
    const playerId = useParams().playerId || "";
    const { gameState, players, question, questionWithAnswer, answerQuestion, sendChatMessage } = useWebSocket(playerId);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-10 px-10">
            {gameState ===  null && <h1 className="text-6xl text-center font-bold">Connecting to server...</h1>}
            {gameState === GameState.WaitingForPlayers && <WaitingForPlayers players={players} currentPlayerId={playerId} sendChatMessage={sendChatMessage} />}
            {gameState === GameState.QuestionInProgress && <ShowQuestion question={question} answerQuestion={answerQuestion} />}
            {gameState === GameState.QuestionComplete && <ShowAnswer question={questionWithAnswer} />}
            {gameState === GameState.GameComplete && <h1 className="text-6xl text-center font-bold">Game over!</h1>}
        </div>
    )
}