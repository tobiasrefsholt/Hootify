import {ReactNode} from "react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.tsx"
import {NewCategoryForm} from "@/pages/dashboardPage/categoriesPage/NewCategoryModal/NewCategoryForm.tsx";

type NewGameModalProps = {
    children: ReactNode;
}

export default function NewCategoryModal({children}: NewGameModalProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>New category</SheetTitle>
                    <SheetDescription>
                        Create a new category to organize your questions.
                    </SheetDescription>
                </SheetHeader>
                <NewCategoryForm />
            </SheetContent>
        </Sheet>
    )
}