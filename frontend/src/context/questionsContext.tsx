import {createContext, ReactNode, useContext, useEffect} from "react";
import {ApiEndpoint, InsertQuestion, QuestionsContextType, QuestionWithAnswer} from "@/Types.ts";
import {useFetch} from "@/hooks/useFetch.ts";
import {toast} from "sonner";

const QuestionContext = createContext<QuestionsContextType>({
    questions: [],
    isPending: true,
    error: null,
    add: () => {
    },
    addMultiple: () => {
    },
    edit: () => {
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
    } = useFetch<QuestionWithAnswer[]>(ApiEndpoint.DashboardGetAllQuestions, []);

    const addFetch = useFetch<null>(ApiEndpoint.DashboardAddQuestion, []);
    const addMultipleFetch = useFetch<null>(ApiEndpoint.DashboardAddMultipleQuestions, []);
    const editFetch = useFetch<null>(ApiEndpoint.DashboardEditQuestion, []);
    const deleteFetch = useFetch<null>(ApiEndpoint.DashboardDeleteQuestion, []);

    const payload = {
        categoryId: "3fa85f64-5717-4562-b3fc-2c963f66afaf",
        search: ""
    }

    // Fetch questions on mount
    useEffect(() => {
        doFetch("POST", [], payload);
    }, []);

    function add(question: InsertQuestion) {
        addFetch.doFetch("POST", [], question, () => {
            toast("Question added");
            // Fetch questions after adding
            doFetch("POST", [], payload);
        });
    }

    function addMultiple(questions: InsertQuestion[]) {
        addMultipleFetch.doFetch("POST", [], questions, () => {
            toast(`Added ${questions.length} questions`);
            // Fetch questions after adding
            doFetch("POST", [], payload);
        });
    }

    function edit(question: InsertQuestion) {
        editFetch.doFetch("POST", [], question, () => {
            toast("Question edited");
            // Fetch questions after change
            doFetch("POST", [], payload);
        });
    }

    function remove(ids: string[]) {
        deleteFetch.doFetch("POST", [], ids, () => {
            toast(ids.length > 1 ? ids.length + " questions deleted" : "Question deleted");
            // Fetch questions after deleting
            doFetch("POST", [], payload);
        });
    }

    const questionsContextValue: QuestionsContextType = {
        questions: questions || [],
        isPending,
        error,
        add,
        addMultiple,
        edit,
        remove
    };

    return (
        <QuestionContext.Provider value={questionsContextValue}>
            {children}
        </QuestionContext.Provider>
    )
}