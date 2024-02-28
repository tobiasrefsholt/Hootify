import * as signalR from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
import { GameState, Player, Question, QuestionWithAnswer } from "../Types";
import { toast } from "sonner";

export function useWebSocket(url: string) {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [question, setQuestion] = useState<Question | null>(null);
    const [questionWithAnswer, setQuestionWithAnswer] = useState<QuestionWithAnswer | null>(null);
    const [leaderBoard, setLeaderBoard] = useState<Player[]>([]);

    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        if (!connectionRef.current) {
            connectionRef.current = new signalR.HubConnectionBuilder()
                .withUrl(url)
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
            setLeaderBoard(players);
        });

        connectionRef.current.on("ReceiveNewQuestion", (gameState: GameState, question: Question) => {
            setGameState(gameState);
            setQuestion(question);
        });

        connectionRef.current.on("ReceiveAnswer", (gameState: GameState, questionWithAnswer: QuestionWithAnswer) => {
            setGameState(gameState);
            setQuestionWithAnswer(questionWithAnswer);
        });

        connectionRef.current.on("ReceiveLeaderBoard", (gameState: GameState, leaderBoard: Player[]) => {
            setGameState(gameState);
            setLeaderBoard(leaderBoard);
        });

        connectionRef.current.on("ReceiveGameComplete", (gameState: GameState) => {
            setGameState(gameState);
        })

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [url])

    function answerQuestion(questionId: string, answer: number) {
        connectionRef.current?.invoke("AnswerQuestion", questionId, answer);
    }

    function sendChatMessage(message: string, sender: string) {
        connectionRef.current?.invoke("SendChatMessage", message, sender);
    }

    return {
        gameState,
        setGameState,
        question,
        setQuestion,
        questionWithAnswer,
        setQuestionWithAnswer,
        leaderBoard,
        setLeaderBoard,
        answerQuestion,
        sendChatMessage,
        connectionRef
    }
}