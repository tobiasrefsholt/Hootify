import {createContext, ReactNode, useContext, useEffect} from "react";
import {ApiEndpoint, CategoriesContextType, Category} from "@/Types.ts";
import {useFetch} from "@/hooks/useFetch.ts";

const CategoryContext = createContext<CategoriesContextType>({
    categories: [],
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

export const useCategories = () => useContext(CategoryContext);

export const CategoriesProvider = ({children}: UserProviderProps) => {
    const {
        data: categories,
        isPending,
        error,
        doFetch
    } = useFetch<Category[]>(ApiEndpoint.DashboardGetAllCategories, []);

    const addFetch = useFetch<null>(ApiEndpoint.DashboardAddCategory, []);
    const deleteFetch = useFetch<null>(ApiEndpoint.DashboardDeleteCategory, []);

    // Fetch categories on mount
    useEffect(() => {
        doFetch("POST", [], null);
    }, []);

    function add(category: Category) {
        addFetch.doFetch("POST", [], category, () => {
            // Fetch categories after adding
            doFetch("POST", [], null);
        });
    }

    function remove(ids: string[]) {
        deleteFetch.doFetch("POST", [], ids, () => {
            // Fetch categories after deleting
            doFetch("POST", [], null);
        });
    }

    const categoriesContextValue: CategoriesContextType = {
        categories: categories || [],
        isPending,
        error,
        add,
        remove
    };

    return (
        <CategoryContext.Provider value={categoriesContextValue}>
            {children}
        </CategoryContext.Provider>
    )
}