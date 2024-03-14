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
    DashboardGetQuestions = "/dashboard/questions/get",
    DashboardGetAllQuestions = "/dashboard/questions/getAll",
    DashboardAddQuestion = "/dashboard/questions/add",
    DashboardAddMultipleQuestions = "/dashboard/questions/addMultiple",
    DashboardDeleteQuestion = "/dashboard/questions/delete",
    DashboardEditQuestion = "/dashboard/questions/edit",
    DashboardGetAllCategories = "/dashboard/categories/getAll",
    DashboardAddCategory = "/dashboard/categories/add",
    DashboardDeleteCategory = "/dashboard/categories/delete",
    DashboardEditCategory = "/dashboard/categories/edit",
    DashboardGetQuiz = "/dashboard/quiz/get",
    DashboardGetAllQuizzes = "/dashboard/quiz/getAll",
    DashboardAddQuiz = "/dashboard/quiz/add",
    DashboardDeleteQuiz = "/dashboard/quiz/delete",
    DashboardEditQuiz = "/dashboard/quiz/edit",
    DashboardGetGame = "/dashboard/game/get",
    DashboardGetAllGames = "/dashboard/game/getAll",
    DashboardAddGame = "/dashboard/game/add",
    DashboardDeleteGame = "/dashboard/game/delete",
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

export type InsertQuestion = {
    id?: string,
    title: string,
    answers: string[],
    correctAnswer: number,
    categoryId: string,
};

export type Question = {
    id: string,
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

export type Category = {
    id: string,
    name: string
};

export type User = {
    email: string
};

export type CategoriesContextType = {
    categories: Category[],
    isPending: boolean,
    error: string | null,
    add: (category: Category) => void,
    remove: (ids: string[]) => void
}

export type GamesContextType = {
    games: Game[],
    isPending: boolean,
    error: string | null,
    add: (question: Game) => void,
    remove: (ids: string[]) => void
}

export type QuestionsContextType = {
    questions: QuestionWithAnswer[],
    isPending: boolean,
    error: string | null,
    add: (question: InsertQuestion) => void,
    addMultiple: (questions: InsertQuestion[]) => void,
    edit: (question: InsertQuestion) => void,
    remove: (ids: string[]) => void
}

export type QuizzesContextType = {
    quizzes: Quiz[],
    isPending: boolean,
    error: string | null,
    add: (question: Quiz) => void,
    edit: (question: Quiz) => void,
    remove: (ids: string[]) => void
}

export type UserContextType = {
    userData: User | null,
    isPending: boolean,
    responseCode: number | null,
    fetch: () => void,
    logout: () => void
};

export type GameOptions = {
    title: string;
    quizId: string;
    randomizeQuestions: boolean;
    randomizeAnswers: boolean;
    secondsPerQuestion: number;
}

export type Game = GameOptions & {
    id: string;
    shareKey: string;
    state: GameState;
    currentQuestionId: string;
    currentQuestionNumber: number;
    currentQuestionStartTime: string;
    remainingQuestions: string[];
}

export type Quiz = {
    id: string;
    title: string;
    description: string;
    questionIds: string[];
}

export type InsertQuiz = {
    title: string;
    description: string;
    questionIds: string[];
}