import { useWebSocket } from "../../hooks/useWebSocket";

export default function GamePage() {
    const playerId = localStorage.getItem('playerId');
    const { gameState, players, question, questionWithAnswer, leaderBoard, answerQuestion } = useWebSocket(playerId);
    return (
        <div>
            <h1>Game</h1>
            <p>Game State: {gameState}</p>
            <p>Players: {players.length}</p>
            <p>Question: {question?.title}</p>
            <p>Answers: {question?.answers}</p>
            <p>Correct answer; {questionWithAnswer?.correctAnswer}</p>
            <button onClick={() => answerQuestion(1)}>Answer 1</button>
            <button onClick={() => answerQuestion(2)}>Answer 2</button>
            <button onClick={() => answerQuestion(3)}>Answer 3</button>
            <button onClick={() => answerQuestion(4)}>Answer 4</button>
        </div>
    )
}