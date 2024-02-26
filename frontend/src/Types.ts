export enum ApiEndpoint {
    Register = "/register",
    Login = "/login?useCookies=true",
    Logout = "/logout",
    Refresh = "/refresh",
    ConfirmEmail = "/confirmEmail",
    ResendConfirmationEmail = "/resendConfirmationEmail",
    ForgotPassword = "/forgotPassword",
    ResetPassword = "/resetPassword",
    ManageTwoFactor = "/manage/2fa",
    ManageInfo = "/manage/info",
    JoinGame = "/game/join",
}

export enum GameState {
    WaitingForPlayers,
    QuestionInProgress,
    ShowAnswer,
    ShowLeaderboard,
    GameComplete
}

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

export type User = {
    email: string
};

export type UserContextType = {
    userData: User | null,
    login: (user: User) => void,
    logout: () => void
};