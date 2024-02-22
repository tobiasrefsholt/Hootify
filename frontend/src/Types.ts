export enum GameState {
    WaitingForPlayers,
    QuestionInProgress,
    QuestionComplete,
    GameComplete
};

export type Player = {
    id: string,
    name: string,
    score: number
};

export type Question = {
    id: string,
    userId: string,
    title: string,
    answers: string[],
    category: string,
    categoryId: string,
    startTime: string,
    seconds: number
};

export type QuestionWithAnswer = Question & {
    correctAnswer: number
};

export type LeaderBoard = {};