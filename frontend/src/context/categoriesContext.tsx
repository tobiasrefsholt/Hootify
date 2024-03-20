import {createContext, ReactNode, useContext, useEffect} from "react";
import {ApiEndpoint, CategoriesContextType, Category} from "@/Types.ts";
import {useFetch} from "@/hooks/useFetch.ts";
import {toast} from "sonner";

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
            toast("Category added");
            // Fetch categories after adding
            doFetch("POST", [], null);
        });
    }

    function remove(ids: string[]) {
        deleteFetch.doFetch("POST", [], ids, () => {
            toast(ids.length > 1 ? ids.length + " categories deleted" : "Category deleted");
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