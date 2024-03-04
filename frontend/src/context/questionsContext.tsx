import {createContext, ReactNode, useContext, useEffect} from "react";
import {ApiEndpoint, Question} from "@/Types.ts";
import {useFetch} from "@/hooks/useFetch.ts";

type QuestionsContextType = {
    questions: Question[],
    isPending: boolean,
    error: string | null,
    add: (question: Question) => void,
    remove: (id: string) => void
}

const QuestionContext = createContext<QuestionsContextType>({
    questions: [],
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
export const useQuestions = () => useContext(QuestionContext);

export const QuestionsProvider = ({children}: UserProviderProps) => {
    const {
        data: questions,
        isPending,
        error,
        doFetch
    } = useFetch<Question[]>(ApiEndpoint.DashboardGetAllQuestions, []);

    const addFetch = useFetch<null>(ApiEndpoint.DashboardAddQuestion, []);
    const deleteFetch = useFetch<null>(ApiEndpoint.DashboardDeleteQuestion, []);

    const payload = {
        categoryId: "3fa85f64-5717-4562-b3fc-2c963f66afaf",
        search: ""
    }

    // Fetch questions on mount
    useEffect(() => {
        doFetch("POST", [], payload);
    }, []);

    function add(question: Question) {
        addFetch.doFetch("POST", [], question, () => {
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

    const questionsContextValue: QuestionsContextType = {
        questions: questions || [],
        isPending,
        error,
        add,
        remove
    };

    return (
        <QuestionContext.Provider value={questionsContextValue}>
            {children}
        </QuestionContext.Provider>
    )
}