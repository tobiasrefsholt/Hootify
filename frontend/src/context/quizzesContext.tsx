import {createContext, ReactNode, useContext, useEffect} from "react";
import {ApiEndpoint, InsertQuiz, Quiz, QuizzesContextType} from "@/Types.ts";
import {useFetch} from "@/hooks/useFetch.ts";
import {toast} from "sonner";

const QuizContext = createContext<QuizzesContextType>({
    quizzes: [],
    isPending: true,
    error: null,
    add: () => {
    },
    edit: () => {
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
    const editFetch = useFetch<null>(ApiEndpoint.DashboardEditQuiz, []);

    // Fetch questions on mount
    useEffect(() => {
        doFetch("POST", [], null);
    }, []);

    useEffect(() => {
        console.log(quizzes)
    }, [quizzes]);

    function add(quiz: InsertQuiz) {
        addFetch.doFetch("POST", [], quiz, () => {
            toast("Quiz added");
            // Fetch questions after adding
            doFetch("POST", [], null);
        });
    }

    function edit(quiz: Quiz) {
        editFetch.doFetch("POST", [], quiz, () => {
            toast("Quiz edited");
            // Fetch questions after adding
            doFetch("POST", [], null);
        });
    }

    function remove(ids: string[]) {
        deleteFetch.doFetch("POST", [], ids, () => {
            toast(ids.length > 1 ? ids.length + " quizzes deleted" : "Quiz deleted");
            // Fetch questions after deleting
            doFetch("POST", [], null);
        });
    }

    const quizzesContextValue: QuizzesContextType = {
        quizzes: quizzes || [],
        isPending,
        error,
        add,
        edit,
        remove
    };

    return (
        <QuizContext.Provider value={quizzesContextValue}>
            {children}
        </QuizContext.Provider>
    )
}