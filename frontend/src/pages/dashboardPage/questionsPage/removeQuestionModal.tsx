import {ReactNode} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";

type RemoveQuestionModalProps = {
    children: ReactNode;
    onCanceled: () => void;
    onConfirm: () => void;
};

export default function RemoveQuestionModal({children, onCanceled, onConfirm}: RemoveQuestionModalProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The question will be permanently removed and all quizzes using this question will be updated.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCanceled}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}