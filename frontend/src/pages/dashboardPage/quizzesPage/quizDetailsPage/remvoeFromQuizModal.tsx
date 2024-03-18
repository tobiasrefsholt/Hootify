import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";

type RemoveFromQuizModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    onConfirmDelete: () => void;
    children: string;
}
export default function RemoveFromQuizModal({open, setOpen, onConfirmDelete, children}: RemoveFromQuizModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will remove all selected questions from the quiz.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        onClick={() => {
                            onConfirmDelete && onConfirmDelete();
                            setOpen(false);
                        }}
                        variant="destructive"
                    >
                        Remove
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}