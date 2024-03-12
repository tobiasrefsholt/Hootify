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

export default function RemoveCategoryModal({children, onCanceled, onConfirmDelete, open, setOpen}: RemoveQuestionModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is irreversible. The category, <b className="text-destructive">and all questions contained</b>, will be permanently deleted, and all questions in this category will be moved to the default category.
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