import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { GameState, LeaderBoard, Player, Question, QuestionWithAnswer } from "../Types";

export function useWebSocket(playerId: string | null) {
    const [message, setMessage] = useState<string>('');
    const [gameState, setGameState] = useState<GameState>(GameState.WaitingForPlayers);
    const [players, setPlayers] = useState<Player[]>([]);
    const [question, setQuestion] = useState<Question | null>(null);
    const [questionWithAnswer, setQuestionWithAnswer] = useState<QuestionWithAnswer | null>(null);
    const [leaderBoard, setLeaderBoard] = useState<LeaderBoard | null>(null);

    const connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5002/ws?playerId=' + playerId)
        .configureLogging(signalR.LogLevel.Information)
        .withHubProtocol(new signalR.JsonHubProtocol())
        .withAutomaticReconnect()
        .build()

    useEffect(() => {
        if (!playerId) throw new Error("PlayerId is required");

        connection.start();

        connection.on('ReceiveMessage', (message: string) => {
            setMessage(message);
        })

        connection.on("ReceiveWaitingPlayers", (gameState: GameState, players: Player[]) => {
            setGameState(gameState);
            setPlayers(players);
        });

        connection.on("ReceiveNewQuestion", (gameState: GameState, question: Question) => {
            setGameState(gameState);
            setQuestion(question);
        });

        connection.on("ReceiveAnswer", (gameState: GameState, questionWithAnswer: QuestionWithAnswer) => {
            setGameState(gameState);
            setQuestionWithAnswer(questionWithAnswer);
        });

        connection.on("ReceiveLeaderBoard", (gameState: GameState, leaderBoard: LeaderBoard) => {
            setGameState(gameState);
            setLeaderBoard(leaderBoard);
        });
    }, [connection])

    function answerQuestion(answer: number) {
        connection.invoke("AnswerQuestion", answer);
    }

    return {
        message,
        gameState,
        players,
        question,
        questionWithAnswer,
        leaderBoard,
        answerQuestion
    }
}