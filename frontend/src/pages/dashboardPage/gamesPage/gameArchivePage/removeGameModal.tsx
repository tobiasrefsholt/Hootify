import {ReactNode} from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";

type RemoveQuestionModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: ReactNode;
    onCanceled?: () => void;
    onConfirmDelete?: () => void;
};

export default function RemoveGameModal({children, onCanceled, onConfirmDelete, open, setOpen}: RemoveQuestionModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is irreversible. The question(s) will be permanently deleted, and any quizzes utilizing this/these question(s) will be automatically updated.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCanceled}>Cancel</AlertDialogCancel>
                    <Button
                        onClick={() => {
                            onConfirmDelete && onConfirmDelete();
                            setOpen(false);
                        }}
                        variant="destructive"
                    >
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}