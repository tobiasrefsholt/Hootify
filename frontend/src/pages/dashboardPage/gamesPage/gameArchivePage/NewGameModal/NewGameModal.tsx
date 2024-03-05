import {ReactNode} from "react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet.tsx"
import {NewGameForm} from "@/pages/dashboardPage/gamesPage/gameArchivePage/NewGameModal/NewGameForm.tsx";

type NewGameModalProps = {
    children: ReactNode;
}

export default function NewGameModal({children}: NewGameModalProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>New game</SheetTitle>
                    <SheetDescription>
                        Select a quiz and generate a new game
                    </SheetDescription>
                </SheetHeader>
                <NewGameForm />
            </SheetContent>
        </Sheet>
    )
}