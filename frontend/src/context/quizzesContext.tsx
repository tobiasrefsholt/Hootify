import {createContext, ReactNode, useContext, useEffect} from "react";
import {ApiEndpoint, Quiz, QuizzesContextType} from "@/Types.ts";
import {useFetch} from "@/hooks/useFetch.ts";

const QuizContext = createContext<QuizzesContextType>({
    quizzes: [],
    isPending: true,
    error: null,
    add: () => {
    },
    remove: () => {
    }
});

type UserProviderProps = {
    children: ReactNode
}
export const useQuizzes = () => useContext(QuizContext);

export const QuizzesProvider = ({children}: UserProviderProps) => {
    const {
        data: quizzes,
        isPending,
        error,
        doFetch
    } = useFetch<Quiz[]>(ApiEndpoint.DashboardGetAllQuizzes, []);

    const addFetch = useFetch<null>(ApiEndpoint.DashboardAddQuiz, []);
    const deleteFetch = useFetch<null>(ApiEndpoint.DashboardDeleteQuiz, []);

    // Fetch questions on mount
    useEffect(() => {
        doFetch("POST", [], null);
    }, []);

    useEffect(() => {
        console.log(quizzes)
    }, [quizzes]);

    function add(game: Quiz) {
        addFetch.doFetch("POST", [], game, () => {
            // Fetch questions after adding
            doFetch("POST", [], null);
        });
    }

    function remove(id: string) {
        deleteFetch.doFetch("POST", [], {id}, () => {
            // Fetch questions after deleting
            doFetch("POST", [], null);
        });
    }

    const quizzesContextValue: QuizzesContextType = {
        quizzes: quizzes || [],
        isPending,
        error,
        add,
        remove
    };

    return (
        <QuizContext.Provider value={quizzesContextValue}>
            {children}
        </QuizContext.Provider>
    )
}