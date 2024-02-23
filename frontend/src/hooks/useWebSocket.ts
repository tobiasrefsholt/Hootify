import * as signalR from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
import { GameState, LeaderBoard, Player, Question, QuestionWithAnswer } from "../Types";
import { toast } from "sonner";

export function useWebSocket(playerId: string | null) {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [question, setQuestion] = useState<Question | null>(null);
    const [questionWithAnswer, setQuestionWithAnswer] = useState<QuestionWithAnswer | null>(null);
    const [leaderBoard, setLeaderBoard] = useState<LeaderBoard | null>(null);

    const connectionRef = useRef<signalR.HubConnection | null>(null);

    console.log("Connecting to websocket on " + import.meta.env.VITE_BACKEND_URL + '/ws?playerId=' + playerId);

    useEffect(() => {
        if (!playerId) throw new Error("PlayerId is required");

        if (!connectionRef.current) {
            connectionRef.current = new signalR.HubConnectionBuilder()
                .withUrl(import.meta.env.VITE_BACKEND_URL + '/ws?playerId=' + playerId)
                .configureLogging(signalR.LogLevel.Information)
                .withHubProtocol(new signalR.JsonHubProtocol())
                .withAutomaticReconnect()
                .build()
        }

        connectionRef.current.start();

        connectionRef.current.on('ReceiveMessage', (message: string) => {
            toast(message);
        })

        connectionRef.current.on('ReceiveChat', (message: string, sender: string = "") => {
            toast(message, {
                description: "Sent by: " + sender
            });
        })

        connectionRef.current.on("ReceiveWaitingPlayers", (gameState: GameState, players: Player[]) => {
            setGameState(gameState);
            setPlayers(players);
        });

        connectionRef.current.on("ReceiveNewQuestion", (gameState: GameState, question: Question) => {
            setGameState(gameState);
            setQuestion(question);
        });

        connectionRef.current.on("ReceiveAnswer", (gameState: GameState, questionWithAnswer: QuestionWithAnswer) => {
            setGameState(gameState);
            setQuestionWithAnswer(questionWithAnswer);
        });

        connectionRef.current.on("ReceiveLeaderBoard", (gameState: GameState, leaderBoard: LeaderBoard) => {
            setGameState(gameState);
            setLeaderBoard(leaderBoard);
        });

        connectionRef.current.on("ReceiveGameComplete", (gameState: GameState) => {
            setGameState(gameState);
        })
    }, [playerId])

    function getGameState() {
        connectionRef.current?.invoke("GetGameState");
    }

    function answerQuestion(questionId: string, answer: number) {
        connectionRef.current?.invoke("AnswerQuestion", questionId, answer);
    }

    function sendChatMessage(message: string, sender: string) {
        connectionRef.current?.invoke("SendChatMessage", message, sender);
    }

    return {
        gameState,
        players,
        question,
        questionWithAnswer,
        leaderBoard,
        getGameState,
        answerQuestion,
        sendChatMessage
    }
}